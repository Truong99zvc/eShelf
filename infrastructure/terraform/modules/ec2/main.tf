variable "vpc_id" {
  type        = string
  description = "ID của VPC"
}

variable "public_subnets" {
  type        = list(string)
  description = "Danh sách public subnet IDs"
}

variable "private_subnets" {
  type        = list(string)
  description = "Danh sách private subnet IDs"
}

variable "project_name" {
  type        = string
  description = "Tên project để gắn tag"
  default     = "eshelf"
}

# Security Group cho Bastion (Public EC2)
resource "aws_security_group" "bastion_sg" {
  name        = "${var.project_name}-bastion-sg"
  description = "SG cho Bastion host (SSH từ IP cố định)"
  vpc_id      = var.vpc_id

  ingress {
    description = "SSH from anywhere (demo) - nên giới hạn IP khi thực tế"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-bastion-sg"
  }
}

# Security Group cho App Server (Private EC2)
resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-app-sg"
  description = "SG cho App server, chỉ cho phép từ Bastion"
  vpc_id      = var.vpc_id

  ingress {
    description     = "SSH từ Bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  # Ví dụ mở port 3000 cho app từ Bastion / LB nội bộ
  ingress {
    description     = "App port từ Bastion"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-app-sg"
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# Bastion host trong public subnet
resource "aws_instance" "bastion" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.micro"
  subnet_id                   = element(var.public_subnets, 0)
  vpc_security_group_ids      = [aws_security_group.bastion_sg.id]
  associate_public_ip_address = true

  tags = {
    Name = "${var.project_name}-bastion"
  }
}

# App server trong private subnet
resource "aws_instance" "app" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"
  subnet_id              = element(var.private_subnets, 0)
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "${var.project_name}-app"
  }
}

output "bastion_public_ip" {
  value       = aws_instance.bastion.public_ip
  description = "Public IP của Bastion host"
}

output "app_private_ip" {
  value       = aws_instance.app.private_ip
  description = "Private IP của App server"
}


