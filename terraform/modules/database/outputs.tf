# RDS DATABASE OUTPUTS
output "db_endpoint" {
  description = "Connection endpoint of the RDS database"
  value       = aws_db_instance.mysql.endpoint
}

output "db_address" {
  description = "DNS hostname address of the RDS database"
  value       = aws_db_instance.mysql.address
}

output "db_port" {
  description = "Database listening port"
  value       = aws_db_instance.mysql.port
}

output "db_name" {
  description = "Initial database name"
  value       = aws_db_instance.mysql.db_name
}


# SECRETS MANAGER OUTPUTS
output "secret_arn" {
  description = "ARN of the Secrets Manager secret storing DB credentials"
  value       = data.aws_secretsmanager_secret.db_credentials.arn
}

output "secret_name" {
  description = "Name of the Secrets Manager secret"
  value       = data.aws_secretsmanager_secret.db_credentials.name
}