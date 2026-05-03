provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "terraform"
      Owner     = "shopsmart-class"
    }
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
