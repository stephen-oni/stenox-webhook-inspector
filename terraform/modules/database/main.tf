# making use of the AWS Secrets Manager to store the database password securely, instead of hardcoding.

data "aws_secretsmanager_secret" "db_credentials" {
  name = "${var.project_name}-db-credentials"      #secret mana=ager secret name
}

data "aws_secretsmanager_secret_version" "db_credentials_version" {
  secret_id = data.aws_secretsmanager_secret.db_credentials.id
}

locals {
  # Parsing the secret JSON string containing during run time.
  db_secret = jsondecode(data.aws_secretsmanager_secret_version.db_credentials_version.secret_string)
}


# rds subnet group is required to place the RDS instance in the private subnets created by the network module. 
resource "aws_db_subnet_group" "rds" {
  name        = "${var.project_name}-db-subnet-group"
  description = "Database subnet group placing RDS in isolated private subnets"
  subnet_ids  = var.db_subnet_ids

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}


# the specification of the RDS instance itself.


resource "aws_db_instance" "mysql" {
  identifier        = "${var.project_name}-db"
  allocated_storage = 20
  storage_type      = "gp3"
  engine            = "mysql"
  engine_version    = "8.0"
  instance_class    = var.db_instance_class

  db_name  = var.db_name
  username = var.db_username
  password = local.db_secret["password"] # Dynamically injected from Secrets Manager

  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [var.db_security_group_id]

  # cost specifications and security settings for the RDS instance
  multi_az            = false # Single-AZ saves 50% on instance costs
  publicly_accessible = false # Blocks direct internet access
  skip_final_snapshot = true  # Avoids hanging/charges on 'terraform destroy'
  deletion_protection = false # Set to true only in production

  tags = {
    Name = "${var.project_name}-mysql"
  }
}