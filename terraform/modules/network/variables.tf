# eks cluster name and AWS region for resource discovery tags

variable "aws_region" {
  description = "AWS region where resources will be deployed"
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Name of the EKS cluster used for resource discovery tags"
  type        = string
  default     = "stenox-eks"
}


variable "vpc_cidr" {
  description = "CIDR block for the entire VPC"
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
  description = "CIDR block for Public Subnet in AZ 1"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_cidr_2" {
  description = "CIDR block for Public Subnet in AZ 2"
  type        = string
  default     = "10.0.2.0/24"
}


variable "private_app_subnet_cidr_1" {
  description = "CIDR block for Private App Subnet in AZ 1"
  type        = string
  default     = "10.0.10.0/24"
}

variable "private_app_subnet_cidr_2" {
  description = "CIDR block for Private App Subnet in AZ 2"
  type        = string
  default     = "10.0.20.0/24"
}


variable "private_db_subnet_cidr_1" {
  description = "CIDR block for Private Database Subnet in AZ 1"
  type        = string
  default     = "10.0.30.0/24"
}

variable "private_db_subnet_cidr_2" {
  description = "CIDR block for Private Database Subnet in AZ 2"
  type        = string
  default     = "10.0.40.0/24"
}