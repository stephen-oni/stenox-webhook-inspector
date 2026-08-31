
output "cluster_name" {
  description = "The name of the EKS cluster"
  value       = aws_eks_cluster.main.name
}

output "cluster_id" {
  description = "The Kubernetes cluster ID"
  value       = aws_eks_cluster.main.id
}

output "cluster_arn" {
  description = "The Amazon Resource Name (ARN) of the cluster"
  value       = aws_eks_cluster.main.arn
}

output "cluster_endpoint" {
  description = "Endpoint for your Kubernetes API server (used by kubectl, Argo CD, and Helm providers)"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = aws_eks_cluster.main.certificate_authority[0].data
}


output "node_group_id" {
  description = "EKS Node Group ID"
  value       = aws_eks_node_group.main_nodes.id
}

output "node_group_arn" {
  description = "Amazon Resource Name (ARN) of the EKS Node Group"
  value       = aws_eks_node_group.main_nodes.arn
}

output "node_group_status" {
  description = "Status of the EKS Node Group (e.g., ACTIVE, CREATING)"
  value       = aws_eks_node_group.main_nodes.status
}

output "node_role_arn" {
  description = "IAM role ARN attached to the EKS worker nodes"
  value       = aws_iam_role.node_role.arn
}


output "oidc_provider_arn" {
  description = "The ARN of the OIDC Provider for IAM Roles for Service Accounts (IRSA)"
  value       = aws_iam_openid_connect_provider.oidc.arn
}

output "oidc_provider_url" {
  description = "The URL on the EKS cluster for the OIDC identity provider"
  value       = aws_eks_cluster.main.identity[0].oidc[0].issuer
}