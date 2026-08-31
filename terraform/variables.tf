variable "aws_region" {
  description = "AWS region for deployments"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name identifier"
  type        = string
  default     = "stenox"
}

variable "environment" {
  description = "Environment identifier"
  type        = string
  default     = "dev"
}


variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zone_1" {
  description = "First availability zone"
  type        = string
  default     = "us-east-1a"
}

variable "availability_zone_2" {
  description = "Second availability zone"
  type        = string
  default     = "us-east-1b"
}

variable "public_subnet_cidr_1" {
  type    = string
  default = "10.0.1.0/24"
}

variable "public_subnet_cidr_2" {
  type    = string
  default = "10.0.2.0/24"
}

variable "private_app_subnet_cidr_1" {
  type    = string
  default = "10.0.10.0/24"
}

variable "private_app_subnet_cidr_2" {
  type    = string
  default = "10.0.20.0/24"
}

variable "private_db_subnet_cidr_1" {
  type    = string
  default = "10.0.30.0/24"
}

variable "private_db_subnet_cidr_2" {
  type    = string
  default = "10.0.40.0/24"
}


variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "stenox-eks"
}

variable "kubernetes_version" {
  description = "Kubernetes version for EKS"
  type        = string
  default     = "1.32"
}

variable "node_instance_types" {
  description = "EC2 instance types for the worker nodes"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "desired_size" {
  type    = number
  default = 2
}

variable "min_size" {
  type    = number
  default = 1
}

variable "max_size" {
  type    = number
  default = 3
}


variable "db_instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "db_name" {
  type    = string
  default = "stenoxdb"
}

variable "db_username" {
  type    = string
  default = "adminuser"
}

variable "db_password" {
  description = "Master password for the database"
  type        = string
  sensitive   = true
}


variable "repository_names" {
  description = "Repositories for container images"
  type        = list(string)
  default     = ["backend", "frontend"]
}