# DATABASE MODULE VARIABLES
variable "project_name" {
  description = "name prefix for resources"
  type        = string
  default     = "stenox"
}

variable "db_subnet_ids" {
  description = "List of private DB subnet IDs passed from the network module"
  type        = list(string)
}

variable "db_security_group_id" {
  description = "Security Group ID for RDS passed from the network module"
  type        = string
}

variable "db_instance_class" {
  description = "RDS instance type"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_name" {
  description = "Name of the initial database"
  type        = string
  default     = "stenoxdb"
}

variable "db_username" {
  description = "Master database username"
  type        = string
  default     = "adminuser"
}