variable "bucket_name_prefix" {
  type        = string
  description = "Prefix for the S3 bucket name"
  default     = "stenox-media-uploads"
}

variable "force_destroy" {
  type        = bool
  description = "Delete all objects when deleting bucket"
  default     = false
}

variable "tags" {
  type        = map(string)
  description = "Resource tags"
  default     = {}
}