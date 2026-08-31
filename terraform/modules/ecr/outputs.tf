output "repository_urls" {
  description = "Map of repository names to their push/pull URLs"
  value       = { for k, v in aws_ecr_repository.repos : k => v.repository_url }
}

output "repository_arns" {
  description = "Map of repository names to their ARNs"
  value       = { for k, v in aws_ecr_repository.repos : k => v.arn }
}

output "registry_id" {
  description = "The registry ID where repositories are hosted (AWS Account ID)"
  value       = values(aws_ecr_repository.repos)[0].registry_id
}