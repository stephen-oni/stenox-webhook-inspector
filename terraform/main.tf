# Network module for VPC, subnets, and security groups
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

# S3 media storage module
module "s3_media" {
  source             = "./modules/s3"
  bucket_name_prefix = "stenox-media"
  force_destroy      = true # Set to true for dev/test environments

  tags = {
    Environment = "dev"
    Project     = "stenox"
  }
}

# EKS module for cluster, worker nodes, and IRSA
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

  aws_region    = var.aws_region
  s3_bucket_arn = module.s3_media.bucket_arn

  depends_on = [module.network]
}

# Database module for RDS instance
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

# ECR module for container repositories
module "ecr" {
  source = "./modules/ecr"

  project_name     = var.project_name
  environment      = var.environment
  repository_names = var.repository_names
}