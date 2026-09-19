output "vpc_id" {
  description = "VPC ID"
  value       = module.network.vpc_id
}

output "alb_dns_name" {
  description = "Public URL of Application Load Balancer"
  value       = module.network.alb_dns_name
}

output "cluster_name" {
  description = "EKS Cluster Name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS API Server Endpoint"
  value       = module.eks.cluster_endpoint
}

output "kubeconfig_command" {
  description = "Run this command locally to authenticate kubectl with your cluster"
  value       = "aws eks --region ${var.aws_region} update-kubeconfig --name ${module.eks.cluster_name}"
}

output "oidc_provider_arn" {
  description = "OIDC ARN for Pod Service Accounts (IRSA)"
  value       = module.eks.oidc_provider_arn
}

output "backend_irsa_role_arn" {
  description = "IAM Role ARN for stenox-backend-sa (IRSA)"
  value       = module.eks.backend_irsa_role_arn
}

output "db_endpoint" {
  description = "Endpoint for connecting to MySQL"
  value       = module.database.db_endpoint
}

output "db_address" {
  description = "Hostname for connecting backend pods to MySQL"
  value       = module.database.db_address
}

output "ecr_repository_urls" {
  description = "Image push targets for GitHub Actions CI"
  value       = module.ecr.repository_urls
}

output "s3_bucket_name" {
  description = "S3 bucket for media uploads"
  value       = module.s3_media.bucket_name
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = module.s3_media.bucket_arn
}