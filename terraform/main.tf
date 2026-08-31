#provider.tf provisioning AWS provider and Terraform Cloud backend configuration
terraform {
  required_version = ">= 1.5.0"

  cloud {
    organization = "YOUR-TERRAFROM-ORGAN" #change this to your terraform cloud organization name

    workspaces {
      name = "YOUR-WORKSPACE-NAME"      #change this to your terraform cloud workspace name
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

#network module for VPC, subnets, and security groups
module "network" {
  source = "./modules/network"

  aws_region                 = var.aws_region
  cluster_name               = var.cluster_name
  vpc_cidr                   = var.vpc_cidr
  availability_zone_1        = var.availability_zone_1
  availability_zone_2        = var.availability_zone_2
  public_subnet_cidr_1       = var.public_subnet_cidr_1
  public_subnet_cidr_2       = var.public_subnet_cidr_2
  private_app_subnet_cidr_1  = var.private_app_subnet_cidr_1
  private_app_subnet_cidr_2  = var.private_app_subnet_cidr_2
  private_db_subnet_cidr_1   = var.private_db_subnet_cidr_1
  private_db_subnet_cidr_2   = var.private_db_subnet_cidr_2
}

#eks module for EKS cluster and worker nodes
module "eks" {
  source = "./modules/eks"

  cluster_name              = var.cluster_name
  kubernetes_version        = var.kubernetes_version
  subnet_ids                = module.network.private_app_subnet_ids
  cluster_security_group_id = module.network.app_sg_id

  node_instance_types = var.node_instance_types
  desired_size        = var.desired_size
  min_size            = var.min_size
  max_size            = var.max_size

  depends_on = [module.network]
}

#database module for RDS instance
module "database" {
  source = "./modules/database"

  project_name         = var.project_name
  db_subnet_ids        = module.network.private_db_subnet_ids
  db_security_group_id = module.network.db_sg_id
  db_instance_class    = var.db_instance_class
  db_name              = var.db_name
  db_username          = var.db_username

  depends_on = [module.network]
}

#ecr module for ECR repositories
module "ecr" {
  source = "./modules/ecr"

  project_name     = var.project_name
  environment      = var.environment
  repository_names = var.repository_names
}