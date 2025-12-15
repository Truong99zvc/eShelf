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

variable "internet_gateway_id" {
  type        = string
  description = "ID của Internet Gateway"
}

# Route table cho public subnets
resource "aws_route_table" "public" {
  vpc_id = var.vpc_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = var.internet_gateway_id
  }

  tags = {
    Name = "eshelf-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(var.public_subnets)
  subnet_id      = var.public_subnets[count.index]
  route_table_id = aws_route_table.public.id
}

# Route table cho private subnets (sử dụng NAT Gateway)
# Để đơn giản, module này giả định NAT GW được tạo trong module khác / manual.
variable "nat_gateway_id" {
  type        = string
  description = "ID của NAT Gateway cho private subnets"
  default     = ""
}

resource "aws_route_table" "private" {
  vpc_id = var.vpc_id

  dynamic "route" {
    for_each = var.nat_gateway_id != "" ? [1] : []
    content {
      cidr_block     = "0.0.0.0/0"
      nat_gateway_id = var.nat_gateway_id
    }
  }

  tags = {
    Name = "eshelf-private-rt"
  }
}

resource "aws_route_table_association" "private" {
  count          = length(var.private_subnets)
  subnet_id      = var.private_subnets[count.index]
  route_table_id = aws_route_table.private.id
}

output "public_route_table_id" {
  value       = aws_route_table.public.id
  description = "ID của public route table"
}

output "private_route_table_id" {
  value       = aws_route_table.private.id
  description = "ID của private route table"
}


