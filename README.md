📚 **eShelf – Digital Book Library (Microservices + DevOps + MLOps)**

Đồ án môn học IE104. Website đọc sách điện tử (eBooks) với kiến trúc **microservices**, **CI/CD**, **Infrastructure as Code** và **MLOps/AIops** cho tính năng gợi ý sách.

Website tham khảo: Z-Library, truyện online (mangadex…)

---

## ✨ Tính năng chính

### 🔐 Xác thực & người dùng
- **Auth**: Đăng ký / Đăng nhập, quên mật khẩu, reset mật khẩu, JWT, đổi mật khẩu.
- **Profile**: Trang hồ sơ, chỉnh sửa thông tin, avatar, thống kê.
- **Phân quyền**: User bình thường & Admin.

### 📖 Thư viện sách
- **Danh sách & tìm kiếm**: Pagination, tìm theo từ khóa/tác giả/NXB, lọc theo thể loại.
- **Chi tiết & đọc sách**: Trang chi tiết sách, đọc PDF trực tuyến, tải về, đếm lượt tải.
- **Thể loại**: Danh sách thể loại, xem sách theo thể loại.

### 👤 Tương tác người dùng
- **Favorites**: Yêu thích sách.
- **Bookmarks**: Đánh dấu sách.
- **Reading history**: Lịch sử đọc + tiến độ đọc.
- **Reviews & Ratings**: Viết review, sửa/xóa, like/unlike review.
- **Feedback & Donations**: Gửi feedback, ủng hộ (donation history, admin xem thống kê).

### 👨‍💼 Admin Panel
- **Quản lý sách**: CRUD sách, phân trang, modal thêm/sửa.
- **Quản lý người dùng**.
- **Quản lý thể loại**.
- **Dashboard**: Thống kê người dùng, sách, phản hồi, donations.

### 🤖 ML / AI – Gợi ý sách (MLOps)
- **ML Service (Node)**:
  - `GET /api/ml/model`: xem metadata model đang deploy.
  - `GET /api/ml/recommendations?userId=...`: trả về danh sách ISBN được gợi ý.
- **Training pipeline (Python)**:
  - Script `mlops/training/train_recommender.py`:
    - Đọc dữ liệu lịch sử đọc (CSV – mock).
    - Train model (mock collaborative filtering).
    - Xuất file `artifacts/model-metadata.json` (giả lập model registry).
- **Giao diện AI**:
  - Trang Home hiển thị thêm block **“Gợi ý riêng cho bạn (AI)”**, ghép ISBN từ ML service với dữ liệu sách thật.

---

## 🏗️ Kiến trúc hệ thống

### Ứng dụng & microservices
- **Frontend**: React + Vite + Tailwind, gọi API qua API Gateway.
- **API Gateway**:
  - `backend/api-gateway/server.js` (port 5000).
  - Proxy các route `/api/auth`, `/api/users`, `/api/books`, `/api/reviews`, `/api/feedback`, `/api/donations`, `/api/ml` tới các service nội bộ.
- **Các microservices** (Node + Express + MongoDB):
  - `auth-service` (port 5101): Đăng ký, đăng nhập, JWT, reset password.
  - `user-service` (port 5102): Profile, favorites, bookmarks, reading history.
  - `book-service` (port 5103): Danh mục sách, chi tiết, tìm kiếm, thể loại.
  - `review-service` (port 5104): Review & like/unlike.
  - `engagement-service` (port 5105): Feedback + donations.
  - `ml-service` (port 5201): Gợi ý sách dựa trên model từ `mlops`.
- **Monolith backend cũ**:
  - `backend/server.js` vẫn còn để so sánh (chạy ở `MONOLITH_PORT` mặc định 5001), nhưng frontend sử dụng **microservices qua API Gateway**.

### Infrastructure as Code & DevOps
- **Terraform** (`infrastructure/terraform`):
  - Module `vpc`: VPC, public/private subnets, Internet Gateway.
  - Module `networking`: Route table public (ra Internet) + private (qua NAT Gateway – optional) + association.
  - Module `ec2`: Bastion host (public subnet) + App server (private subnet) + Security Groups đúng yêu cầu Lab 1.
- **CloudFormation** (`infrastructure/cloudformation`):
  - `templates/vpc-stack.yaml`: VPC + IGW.
  - `templates/ec2-stack.yaml`: Bastion + App EC2 + Security Groups.
  - `tests/taskcat.yaml`: Cấu hình Taskcat để test template.
- **CI/CD (GitHub Actions + Jenkins)**:
  - `.github/workflows/ci.yml`:
    - Lint + test + build frontend.
    - `terraform fmt` + `terraform validate`.
    - **Checkov** scan Terraform.
  - `.github/workflows/cloudformation.yml`:
    - `cfn-lint` cho CloudFormation templates.
    - `taskcat` (dry-run) cho stack tests.
  - `jenkins/Jenkinsfile`:
    - Stages: `Lint & Test` → `SonarQube` (placeholder) → `Docker Build` (tất cả services) → `Trivy Scan` (placeholder) → `Push Images` → `Deploy K8s` (placeholder).
- **Kubernetes** (`k8s/manifests`):
  - `api-gateway-deployment.yaml`: Deployment + Service (LoadBalancer) cho API Gateway.
  - `ml-service-deployment.yaml`: Deployment + Service cho ML service.

---

## 🛠️ Tech stack

### Frontend
- **React 18**, **React Router**, **Vite**, **TailwindCSS**, **Lucide React**.
- State: React Context, localStorage.

### Backend & ML
- **Node.js**, **Express.js**.
- **MongoDB** + **Mongoose**.
- **JWT**, **bcryptjs**.
- **Python** cho training script (`mlops/training`).

### DevOps / MLOps
- **Terraform**, **CloudFormation**, **Taskcat**, **Checkov**.
- **GitHub Actions**, **Jenkins** (Pipeline), **Docker**.
- **Kubernetes** (manifests deploy services).

---

## 📋 Yêu cầu hệ thống

- **Node.js** >= 18.x
- **MongoDB** >= 6.x (local hoặc MongoDB Atlas)
- **npm**
- Python 3.x (nếu muốn chạy script training ML)

---

## 🚀 Cài đặt & chạy ứng dụng

### 1. Clone repository

```bash
git clone https://github.com/yourusername/eShelf.git
cd eShelf
```

### 2. Cài đặt dependencies frontend

```bash
npm install
```

Các service backend/microservices sẽ tự `npm install` khi dùng script chạy tất cả (xem bên dưới).

### 3. Cấu hình môi trường backend

Tạo file `.env` trong thư mục `backend` (dùng chung cho các service vì tái sử dụng `config/db.js`):

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eshelf
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

**Lưu ý**:  
- API Gateway mặc định sử dụng port `5000`.  
- Monolith backend (cũ) dùng `MONOLITH_PORT=5001` (không cần chạy cho frontend).  
- Nếu dùng MongoDB Atlas, thay `MONGODB_URI` bằng connection string của bạn.

### 4. Khởi động MongoDB

```bash
# Nếu dùng MongoDB local
mongod
```

Hoặc dùng dịch vụ MongoDB Atlas.

### 5. Seed dữ liệu mẫu

```bash
cd backend
npm run seed
```

Lệnh này sẽ:
- Import ~40 cuốn sách mẫu.
- Tạo danh sách thể loại.
- Tạo 2 tài khoản test: `admin` và `testuser`.

### 6. Chạy toàn bộ hệ thống (frontend + microservices + API Gateway)

Trên **Windows PowerShell**, tại thư mục gốc `eShelf`:

```powershell
# (Lần đầu, nếu cần)
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

.\run-all.ps1
```

Script `run-all.ps1` sẽ:
- Mở nhiều cửa sổ PowerShell, mỗi cửa sổ chạy 1 service:
  - API Gateway (`backend/api-gateway`)
  - `auth-service`, `user-service`, `book-service`, `review-service`, `engagement-service`, `ml-service`
  - Frontend (Vite)
- Tự `npm install` nếu chưa có `node_modules`.

Sau khi tất cả cửa sổ service hiển thị “running”, mở trình duyệt:

- **Frontend**: `http://localhost:5173`
- **API Gateway health**: `http://localhost:5000/api/health`

### 7. Chạy thủ công (tuỳ chọn)

- **Frontend**:

```bash
npm run dev
```

- **API Gateway**:

```bash
cd backend/api-gateway
npm install
npm run dev   # port 5000
```

- **Mỗi microservice** (ví dụ `auth-service`):

```bash
cd backend/services/auth-service
npm install
npm run dev   # AUTH_SERVICE_PORT mặc định 5101
```

Các service khác tương tự (`user-service`, `book-service`, `review-service`, `engagement-service`, `ml-service`).

---

## 🧪 Tài khoản test

Sau khi chạy `npm run seed` trong `backend`, có thể đăng nhập:

| Username   | Password   | Vai trò |
|-----------|-----------|---------|
| `admin`   | `Admin@123` | Admin   |
| `testuser` | `Test@123` | User    |

---

## 📁 Cấu trúc project (rút gọn)

```text
eShelf/
├── src/                       # Frontend React
│   ├── components/            # UI components
│   ├── pages/                 # Pages (Home, BookDetail, Admin, ...)
│   ├── services/              # API clients (auth, book, user, ml, ...)
│   └── styles/                # Tailwind / global styles
│
├── backend/
│   ├── api-gateway/           # API Gateway (http-proxy-middleware)
│   ├── services/
│   │   ├── auth-service/
│   │   ├── user-service/
│   │   ├── book-service/
│   │   ├── review-service/
│   │   ├── engagement-service/
│   │   └── ml-service/
│   ├── config/                # DB & app config (shared)
│   ├── models/                # Mongoose models (shared)
│   ├── routes/                # Express routes (shared)
│   ├── middleware/            # Auth, error handling
│   ├── seedData.js
│   └── server.js              # Monolith backend (demo/legacy)
│
├── mlops/
│   └── training/
│       └── train_recommender.py   # Script train model + export metadata
│
├── infrastructure/
│   ├── terraform/             # Terraform modules (VPC, networking, EC2)
│   └── cloudformation/        # CloudFormation templates + taskcat tests
│
├── k8s/                       # K8s manifests (gateway, ml-service, ...)
├── jenkins/                   # Jenkinsfile pipeline
├── public/                    # Static assets (images, pdfs, demo screenshots)
└── run-all.ps1                # Script chạy tất cả services trên Windows
```

---

## 📚 API endpoints (chính)

### Auth
- `POST /api/auth/register` – Đăng ký
- `POST /api/auth/login` – Đăng nhập
- `GET /api/auth/me` – Lấy thông tin user (protected)
- `POST /api/auth/forgot-password` – Quên mật khẩu
- `POST /api/auth/reset-password` – Reset mật khẩu
- `PUT /api/auth/update-password` – Đổi mật khẩu (protected)

### Books
- `GET /api/books` – Danh sách sách (có phân trang)
- `GET /api/books/search` – Tìm kiếm
- `GET /api/books/:isbn` – Chi tiết sách
- `GET /api/books/genres` – Danh sách thể loại
- `GET /api/books/genre/:genreName` – Sách theo thể loại
- `POST /api/books/:isbn/download` – Tăng lượt tải

### Users
- `PUT /api/users/profile` – Cập nhật profile
- `GET /api/users/favorites` – Sách yêu thích
- `POST /api/users/favorites/:isbn` – Thêm yêu thích
- `GET /api/users/bookmarks` – Sách đánh dấu
- `GET /api/users/reading-history` – Lịch sử đọc

### Reviews
- `GET /api/reviews/book/:isbn` – Reviews của sách
- `POST /api/reviews` – Tạo review
- `PUT /api/reviews/:id` – Sửa review
- `DELETE /api/reviews/:id` – Xóa review
- `POST /api/reviews/:id/like` – Like/Unlike review

### Feedback & Donations
- `POST /api/feedback` – Gửi feedback
- `GET /api/feedback` – Admin xem feedback
- `POST /api/donations` – Tạo donation
- `GET /api/donations/my-donations` – Lịch sử ủng hộ

### ML / AI
- `GET /api/ml/model` – Thông tin model đang deploy.
- `GET /api/ml/recommendations?userId=...` – Gợi ý sách cho user.

---

## 🎨 Hình ảnh demo

![Main Page](public/demo/main.png)
![Login Page](public/demo/login-register.png)
![Search Result Page](public/demo/search-result.png)
![Book Detail Page](public/demo/book-detail.png)
![Genres Page](public/demo/genres.png)
![Donate Page](public/demo/donate.png)
![Feedback Page](public/demo/feedback.png)

---

## 👥 Thành viên

| MSSV     | Họ tên      | Vai trò                             |
|----------|------------|--------------------------------------|
| 23521809 | Lê Văn Vũ  | Full-stack / DevOps / MLOps Engineer |

---

## 📄 License & liên hệ

- License: **ISC**
- Liên hệ: cập nhật GitHub/Email theo yêu cầu đồ án.

**Made with ❤️ for IE104 (DevOps / MLOps project)**
