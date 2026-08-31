# vpc and the internet gateway provision
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name                                           = "stenox-vpc"
    "kubernetes.io/cluster/${var.cluster_name}"     = "shared"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "stenox-igw"
  }
}


# 6 subnet across two zone and each zone have three each.
resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr_1
  availability_zone       = var.availability_zone_1
  map_public_ip_on_launch = true

  tags = {
    Name                                           = "stenox-public-subnet-1"
    "kubernetes.io/role/elb"                       = "1"
    "kubernetes.io/cluster/${var.cluster_name}"     = "shared"
  }
}

resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr_2
  availability_zone       = var.availability_zone_2
  map_public_ip_on_launch = true

  tags = {
    Name                                           = "stenox-public-subnet-2"
    "kubernetes.io/role/elb"                       = "1"
    "kubernetes.io/cluster/${var.cluster_name}"     = "shared"
  }
}

resource "aws_subnet" "private_app_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.private_app_subnet_cidr_1
  availability_zone       = var.availability_zone_1
  map_public_ip_on_launch = false

  tags = {
    Name                                           = "stenox-private-subnet-1"
    "kubernetes.io/role/internal-elb"              = "1"
    "kubernetes.io/cluster/${var.cluster_name}"     = "shared"
  }
}

resource "aws_subnet" "private_app_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.private_app_subnet_cidr_2
  availability_zone       = var.availability_zone_2
  map_public_ip_on_launch = false

  tags = {
    Name                                           = "stenox-private-subnet-2"
    "kubernetes.io/role/internal-elb"              = "1"
    "kubernetes.io/cluster/${var.cluster_name}"     = "shared"
  }
}

resource "aws_subnet" "private_db_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.private_db_subnet_cidr_1
  availability_zone       = var.availability_zone_1
  map_public_ip_on_launch = false

  tags = {
    Name = "stenox-private-db-subnet-1"
  }
}

resource "aws_subnet" "private_db_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.private_db_subnet_cidr_2
  availability_zone       = var.availability_zone_2
  map_public_ip_on_launch = false

  tags = {
    Name = "stenox-private-db-subnet-2"
  }
}


# 3. NAT gateway for update of worker nodes & elastic for each zone for target group.
resource "aws_eip" "nat_1" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.igw]

  tags = {
    Name = "stenox-nat-eip-1"
  }
}

resource "aws_eip" "nat_2" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.igw]

  tags = {
    Name = "stenox-nat-eip-2"
  }
}

resource "aws_nat_gateway" "nat_1" {
  allocation_id = aws_eip.nat_1.id
  subnet_id     = aws_subnet.public_1.id

  tags = {
    Name = "stenox-nat-gw-1"
  }

  depends_on = [aws_internet_gateway.igw]
}

resource "aws_nat_gateway" "nat_2" {
  allocation_id = aws_eip.nat_2.id
  subnet_id     = aws_subnet.public_2.id

  tags = {
    Name = "stenox-nat-gw-2"
  }

  depends_on = [aws_internet_gateway.igw]
}


# 4. route table and its association for public, private app and private db subnets.
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "stenox-public-rt"
  }
}

resource "aws_route_table_association" "public_1_assoc" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_2_assoc" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public_rt.id
}

# private route table for app subnets to route traffic through NAT gateways for internet access
resource "aws_route_table" "private_app_rt_1" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_1.id
  }

  tags = {
    Name = "stenox-private-rt-1"
  }
}

resource "aws_route_table" "private_app_rt_2" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_2.id
  }

  tags = {
    Name = "stenox-private-rt-2"
  }
}

resource "aws_route_table_association" "private_app_1_assoc" {
  subnet_id      = aws_subnet.private_app_1.id
  route_table_id = aws_route_table.private_app_rt_1.id
}

resource "aws_route_table_association" "private_app_2_assoc" {
  subnet_id      = aws_subnet.private_app_2.id
  route_table_id = aws_route_table.private_app_rt_2.id
}

# peivate db route table for db subnets to route traffic through NAT gateways for internet access
resource "aws_route_table" "private_db_rt" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "stenox-private-db-rt"
  }
}

resource "aws_route_table_association" "private_db_1_assoc" {
  subnet_id      = aws_subnet.private_db_1.id
  route_table_id = aws_route_table.private_db_rt.id
}

resource "aws_route_table_association" "private_db_2_assoc" {
  subnet_id      = aws_subnet.private_db_2.id
  route_table_id = aws_route_table.private_db_rt.id
}

#secuirty groups for ALB, EKS nodes and RDS database
resource "aws_security_group" "alb_sg" {
  name        = "stenox-alb-sg"
  description = "Ingress for Public Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Allow HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "stenox-alb-sg"
  }
}


resource "aws_security_group" "app_sg" {
  name        = "stenox-app-sg"
  description = "Ingress strictly from ALB, no direct internet"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow HTTP traffic from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  ingress {
    description = "Node-to-node internal communication"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  egress {
    description = "Allow all outbound to NAT, internet, and RDS"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "stenox-app-sg"
  }
}


resource "aws_security_group" "db_sg" {
  name        = "stenox-db-sg"
  description = "Ingress strictly MySQL port 3306 from App SG"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "MySQL from App/EKS Node SG"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  egress {
    description = "Outbound within VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
  }

  tags = {
    Name = "stenox-db-sg"
  }
}


# application load balancer for the EKS cluster to route traffic to the pods running in the private subnets
resource "aws_lb" "api_alb" {
  name               = "stenox-api-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  enable_deletion_protection = false

  tags = {
    Name = "stenox-api-alb"
  }
}

resource "aws_lb_target_group" "api_tg" {
  name        = "stenox-api-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip" # 'ip' is recommended for EKS container pod targeting

  health_check {
    enabled             = true
    path                = "/api/user"
    protocol            = "HTTP"
    port                = "traffic-port"
    matcher             = "200-399,401"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name = "stenox-api-tg"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.api_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api_tg.arn
  }
}