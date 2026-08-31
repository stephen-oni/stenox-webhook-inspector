variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "stenox"
}

variable "environment" {
  description = "Environment identifier"
  type        = string
  default     = "dev"
}

variable "repository_names" {
  description = "List of components requiring an ECR registry"
  type        = list(string)
  default     = ["backend", "frontend"]
}

variable "image_tag_mutability" {
  description = "The tag mutability setting for the repository (MUTABLE or IMMUTABLE)"
  type        = string
  default     = "MUTABLE"
}

variable "force_delete" {
  description = "Allow deletion of repository containing images when running terraform destroy"
  type        = bool
  default     = true
}