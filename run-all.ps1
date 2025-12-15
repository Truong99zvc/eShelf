<# 
  Run all eShelf services (microservices + API Gateway + frontend) on Windows PowerShell.

  Cách dùng:
    1. Mở PowerShell ở thư mục gốc dự án (chứa file này).
    2. (Lần đầu) Có thể cần: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
    3. Chạy: .\run-all.ps1

  Script sẽ:
    - Mở nhiều cửa sổ PowerShell, mỗi cửa sổ chạy 1 service.
    - Tự động npm install trước khi npm run dev (giúp lần đầu không lỗi thiếu node_modules).
#>

$root = Split-Path $MyInvocation.MyCommand.Path -Parent
Set-Location $root

function Start-ServiceWindow {
    param (
        [string]$Name,
        [string]$RelativePath,
        [string]$DevCommand
    )

    $fullPath = Join-Path $root $RelativePath

    if (-not (Test-Path $fullPath)) {
        Write-Host "❌ Bỏ qua $Name vì không tìm thấy thư mục: $fullPath" -ForegroundColor Red
        return
    }

    Write-Host "🚀 Đang mở cửa sổ cho $Name tại $fullPath" -ForegroundColor Green

    # Mỗi cửa sổ mới: cd vào thư mục, npm install (nếu cần), rồi chạy dev
    $command = @"
cd `"$fullPath`"
if (-not (Test-Path node_modules)) { 
  Write-Host '🔧 Installing dependencies for $Name...' -ForegroundColor Yellow
  npm install 
}
Write-Host '▶️ Starting $Name...' -ForegroundColor Cyan
$DevCommand
"@

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
}

Write-Host "========================================"
Write-Host " eShelf - Run All Services (Windows)    "
Write-Host "========================================"
Write-Host ""
Write-Host "⚠️  Hãy đảm bảo MongoDB đang chạy (mongod) hoặc bạn dùng MongoDB Atlas." -ForegroundColor Yellow
Write-Host ""

# API Gateway
Start-ServiceWindow -Name "API Gateway" -RelativePath "backend\api-gateway" -DevCommand "npm run dev"

# Auth Service
Start-ServiceWindow -Name "Auth Service" -RelativePath "backend\services\auth-service" -DevCommand "npm run dev"

# User Service
Start-ServiceWindow -Name "User Service" -RelativePath "backend\services\user-service" -DevCommand "npm run dev"

# Book Service
Start-ServiceWindow -Name "Book Service" -RelativePath "backend\services\book-service" -DevCommand "npm run dev"

# Review Service
Start-ServiceWindow -Name "Review Service" -RelativePath "backend\services\review-service" -DevCommand "npm run dev"

# Engagement Service (Feedback + Donations)
Start-ServiceWindow -Name "Engagement Service" -RelativePath "backend\services\engagement-service" -DevCommand "npm run dev"

# ML Service
Start-ServiceWindow -Name "ML Service" -RelativePath "backend\services\ml-service" -DevCommand "npm run dev"

# Frontend
Start-ServiceWindow -Name "Frontend (Vite)" -RelativePath "." -DevCommand "npm run dev"

Write-Host ""
Write-Host "✅ Đã mở các cửa sổ service. Vào trình duyệt: http://localhost:5173" -ForegroundColor Green


