variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "stenox-eks"
}

variable "kubernetes_version" {
  description = "Desired Kubernetes minor version for the control plane"
  type        = string
  default     = "1.32"
}

variable "subnet_ids" {
  description = "List of private subnet IDs where EKS ENIs and worker nodes will be deployed"
  type        = list(string)
}

variable "cluster_security_group_id" {
  description = "Security Group ID applied to the EKS cluster control plane communication"
  type        = string
}

variable "node_instance_types" {
  description = "EC2 instance types for the EKS managed worker nodes"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "desired_size" {
  description = "Initial desired number of worker nodes"
  type        = number
  default     = 2
}

variable "min_size" {
  description = "Minimum number of worker nodes for autoscaling"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum number of worker nodes for autoscaling"
  type        = number
  default     = 3
}