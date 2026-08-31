output "vpc_id" {
  description = "The ID of the main VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "The CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "internet_gateway_id" {
  description = "The ID of the Internet Gateway"
  value       = aws_internet_gateway.igw.id
}

# Public Subnets (ALB & NAT Gateways)
output "public_subnet_1_id" {
  description = "The ID of Public Subnet 1"
  value       = aws_subnet.public_1.id
}

output "public_subnet_2_id" {
  description = "The ID of Public Subnet 2"
  value       = aws_subnet.public_2.id
}

output "public_subnet_ids" {
  description = "List of all public subnet IDs"
  value       = [aws_subnet.public_1.id, aws_subnet.public_2.id]
}

# Private App Subnets (EKS Worker Nodes & Workloads)
output "private_app_subnet_1_id" {
  description = "The ID of Private App Subnet 1"
  value       = aws_subnet.private_app_1.id
}

output "private_app_subnet_2_id" {
  description = "The ID of Private App Subnet 2"
  value       = aws_subnet.private_app_2.id
}

output "private_app_subnet_ids" {
  description = "List of all private app subnet IDs for EKS nodes"
  value       = [aws_subnet.private_app_1.id, aws_subnet.private_app_2.id]
}

# Private DB Subnets (RDS Multi-AZ)
output "private_db_subnet_1_id" {
  description = "The ID of Private DB Subnet 1"
  value       = aws_subnet.private_db_1.id
}

output "private_db_subnet_2_id" {
  description = "The ID of Private DB Subnet 2"
  value       = aws_subnet.private_db_2.id
}

output "private_db_subnet_ids" {
  description = "List of all private DB subnet IDs for RDS Subnet Group"
  value       = [aws_subnet.private_db_1.id, aws_subnet.private_db_2.id]
}


output "alb_sg_id" {
  description = "The ID of the Public ALB Security Group"
  value       = aws_security_group.alb_sg.id
}

output "app_sg_id" {
  description = "The ID of the EKS Worker Node / App Security Group"
  value       = aws_security_group.app_sg.id
}

output "db_sg_id" {
  description = "The ID of the RDS Database Security Group"
  value       = aws_security_group.db_sg.id
}


output "alb_arn" {
  description = "The ARN of the Application Load Balancer"
  value       = aws_lb.api_alb.arn
}

output "alb_dns_name" {
  description = "The public DNS name of the Application Load Balancer"
  value       = aws_lb.api_alb.dns_name
}

output "alb_target_group_arn" {
  description = "The ARN of the default ALB Target Group"
  value       = aws_lb_target_group.api_tg.arn
}