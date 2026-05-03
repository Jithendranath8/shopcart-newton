resource "random_id" "suffix" {
  byte_length = 4
}

locals {
  name_prefix    = var.project_name
  unique_suffix  = random_id.suffix.hex
  account_id     = data.aws_caller_identity.current.account_id
  region         = data.aws_region.current.name
  static_bucket  = "${local.name_prefix}-static-${local.unique_suffix}"
  ecr_repo_name  = "${local.name_prefix}-backend"
  cluster_name   = "${local.name_prefix}-cluster"
  service_name   = "${local.name_prefix}-service"
  task_family    = "${local.name_prefix}-task"
  alb_name       = "${local.name_prefix}-alb"
  rds_identifier = "${local.name_prefix}-mysql"
  log_group      = "/ecs/${local.name_prefix}"
}
