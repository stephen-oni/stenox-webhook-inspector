# 1. Base Application Namespace
resource "kubernetes_namespace" "dev" {
  metadata {
    name = "dev"
  }

  depends_on = [module.eks]
}

# 2. IRSA ServiceAccount with Dynamic IAM Role Binding
resource "kubernetes_service_account" "backend_sa" {
  metadata {
    name      = "stenox-backend-sa"
    namespace = kubernetes_namespace.dev.metadata[0].name
    annotations = {
      "eks.amazonaws.com/role-arn" = module.eks.backend_irsa_role_arn
    }
  }

  depends_on = [module.eks]
}

# 3. External Secrets Operator
resource "helm_release" "external_secrets" {
  name             = "external-secrets"
  repository       = "https://charts.external-secrets.io"
  chart            = "external-secrets"
  version          = "0.9.18"
  namespace        = "external-secrets"
  create_namespace = true

  set {
    name  = "installCRDs"
    value = "true"
  }

  depends_on = [module.eks]
}

# 4. Ingress-NGINX (Provisions AWS NLB)
resource "helm_release" "ingress_nginx" {
  name             = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  version          = "4.10.1"
  namespace        = "ingress-nginx"
  create_namespace = true

  values = [
    yamlencode({
      controller = {
        config = {
          use-proxy-protocol = "true"
        }
        service = {
          annotations = {
            "service.beta.kubernetes.io/aws-load-balancer-type"           = "nlb"
            "service.beta.kubernetes.io/aws-load-balancer-scheme"         = "internet-facing"
            "service.beta.kubernetes.io/aws-load-balancer-proxy-protocol" = "*"
          }
        }
      }
    })
  ]

  depends_on = [module.eks]
}

# 5. Argo CD Helm Release
resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = "5.51.6"
  namespace        = "argocd"
  create_namespace = true

  depends_on = [module.eks]
}

# 6. Argo CD Root Application (Automated GitOps App-of-Apps)
resource "kubernetes_manifest" "argocd_root_app" {
  manifest = {
    apiVersion = "argoproj.io/v1alpha1"
    kind       = "Application"
    metadata = {
      name      = "stenox-root-application"
      namespace = "argocd"
      finalizers = [
        "resources-finalizer.argocd.argoproj.io"
      ]
    }
    spec = {
      project = "default"
      source = {
        repoURL        = "https://github.com/stephenoni/stenox-webhook-inspector.git"
        targetRevision = "HEAD"
        path           = "gitops"
        directory = {
          recurse = false
          include = "stenox-dev-app.yml"
        }
      }
      destination = {
        server    = "https://kubernetes.default.svc"
        namespace = "argocd"
      }
      syncPolicy = {
        automated = {
          prune    = true
          selfHeal = true
        }
        syncOptions = [
          "CreateNamespace=true"
        ]
      }
    }
  }

  depends_on = [helm_release.argocd]
}