# eShelf Backend API

Backend API cho ứng dụng thư viện sách điện tử eShelf.

## 🚀 Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Yêu cầu

- Node.js >= 18.x
- MongoDB >= 6.x (local hoặc MongoDB Atlas)

## 🛠️ Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` trong thư mục `backend`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eshelf
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### 3. Khởi động MongoDB

```bash
# Nếu dùng MongoDB local
mongod
```

### 4. Seed dữ liệu (tùy chọn)

```bash
npm run seed
```

### 5. Chạy server

```bash
# Development mode (với auto-reload)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/me` | Lấy thông tin user (protected) |
| POST | `/api/auth/forgot-password` | Yêu cầu reset mật khẩu |
| POST | `/api/auth/reset-password` | Reset mật khẩu |
| PUT | `/api/auth/update-password` | Đổi mật khẩu (protected) |

### Books

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/books` | Lấy danh sách sách |
| GET | `/api/books/search` | Tìm kiếm sách |
| GET | `/api/books/genres` | Lấy danh sách thể loại |
| GET | `/api/books/genre/:genreName` | Lấy sách theo thể loại |
| GET | `/api/books/:isbn` | Lấy chi tiết sách |
| GET | `/api/books/:isbn/related` | Lấy sách liên quan |
| POST | `/api/books/:isbn/download` | Tăng lượt tải |
| POST | `/api/books` | Thêm sách mới (admin) |
| PUT | `/api/books/:isbn` | Sửa sách (admin) |
| DELETE | `/api/books/:isbn` | Xóa sách (admin) |

### Users

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| PUT | `/api/users/profile` | Cập nhật profile |
| GET | `/api/users/favorites` | Lấy DS yêu thích |
| POST | `/api/users/favorites/:isbn` | Thêm yêu thích |
| DELETE | `/api/users/favorites/:isbn` | Xóa yêu thích |
| GET | `/api/users/bookmarks` | Lấy DS đánh dấu |
| POST | `/api/users/bookmarks/:isbn` | Thêm đánh dấu |
| DELETE | `/api/users/bookmarks/:isbn` | Xóa đánh dấu |
| GET | `/api/users/reading-history` | Lấy lịch sử đọc |

### Reviews

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/reviews/book/:isbn` | Lấy reviews của sách |
| POST | `/api/reviews` | Tạo review (protected) |
| GET | `/api/reviews/my-reviews` | Lấy reviews của tôi |
| PUT | `/api/reviews/:id` | Sửa review |
| DELETE | `/api/reviews/:id` | Xóa review |
| POST | `/api/reviews/:id/like` | Like/Unlike review |

### Feedback

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/feedback` | Gửi feedback |
| GET | `/api/feedback/my-feedback` | Lấy feedback của tôi |
| GET | `/api/feedback` | Lấy tất cả feedback (admin) |
| PUT | `/api/feedback/:id` | Cập nhật feedback (admin) |

### Donations

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/donations` | Tạo donation |
| GET | `/api/donations/status/:transactionId` | Kiểm tra trạng thái |
| GET | `/api/donations/my-donations` | Lấy lịch sử donate |
| GET | `/api/donations` | Lấy tất cả donations (admin) |

## 🔐 Authentication

API sử dụng JWT (JSON Web Token). Để truy cập các endpoint protected:

```
Authorization: Bearer <your_jwt_token>
```

## 📁 Cấu trúc thư mục

```
backend/
├── config/
│   ├── config.js         # Cấu hình môi trường
│   └── db.js             # Kết nối MongoDB
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   ├── donationController.js
│   ├── feedbackController.js
│   ├── reviewController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js # JWT authentication
│   └── errorMiddleware.js
├── models/
│   ├── Book.js
│   ├── Donation.js
│   ├── Feedback.js
│   ├── Genre.js
│   ├── Review.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   ├── donationRoutes.js
│   ├── feedbackRoutes.js
│   ├── reviewRoutes.js
│   └── userRoutes.js
├── package.json
├── seedData.js           # Script seed dữ liệu
├── server.js             # Entry point
└── README.md
```

## 🧪 Test Users

Sau khi chạy `npm run seed`:

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | admin |
| testuser | Test@123 | user |

## 📝 License

ISC

