# 📚 eShelf - Digital Book Library

Đồ án môn học IE104. Website đọc sách điện tử (eBooks) với đầy đủ tính năng quản lý thư viện số.

Website tham khảo: [Z-Library](https://en.wikipedia.org/wiki/Z-Library)

## ✨ Tính năng

### 🔐 Xác thực người dùng
- ✅ Đăng ký / Đăng nhập tài khoản
- ✅ Quên mật khẩu & Đặt lại mật khẩu
- ✅ JWT Authentication
- ✅ Quản lý profile người dùng

### 📖 Quản lý sách
- ✅ Xem danh sách sách với pagination
- ✅ Tìm kiếm sách theo từ khóa, tác giả, nhà xuất bản
- ✅ Lọc sách theo thể loại, năm xuất bản, ngôn ngữ
- ✅ Xem chi tiết sách (thông tin đầy đủ, mô tả, PDF)
- ✅ Đọc sách trực tuyến (PDF viewer)
- ✅ Tải sách xuống

### 👤 Tính năng người dùng
- ✅ Yêu thích sách (Favorites)
- ✅ Đánh dấu sách (Bookmarks)
- ✅ Lịch sử đọc sách với tiến độ
- ✅ Đánh giá & Bình luận sách
- ✅ Like/Unlike đánh giá

### 📝 Hỗ trợ & Tương tác
- ✅ Gửi phản hồi (Feedback) về lỗi
- ✅ Ủng hộ dự án (Donations) qua nhiều phương thức
- ✅ Quản lý thể loại sách

### 👨‍💼 Admin Panel
- ✅ Quản lý sách (CRUD)
- ✅ Quản lý người dùng
- ✅ Xem & xử lý feedback
- ✅ Xem thống kê donations

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **React Router** - Routing
- **TailwindCSS** - Styling
- **Axios** - HTTP Client
- **Vite** - Build Tool
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## 📋 Yêu cầu hệ thống

- **Node.js** >= 18.x
- **MongoDB** >= 6.x (local hoặc MongoDB Atlas)
- **npm** hoặc **yarn**

## 🚀 Cài đặt & Chạy project

### 1. Clone repository

```bash
git clone https://github.com/yourusername/eShelf.git
cd eShelf
```

### 2. Cài đặt dependencies

```bash
# Cài đặt dependencies cho cả Frontend và Backend
npm run install:all
```

Hoặc cài đặt riêng:

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` trong thư mục `backend`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eshelf
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

**Lưu ý:** Nếu dùng MongoDB Atlas, thay `MONGODB_URI` bằng connection string của bạn.

### 4. Khởi động MongoDB

```bash
# Nếu dùng MongoDB local
mongod
```

Hoặc sử dụng MongoDB Atlas (cloud).

### 5. Seed dữ liệu mẫu

```bash
npm run seed
```

Lệnh này sẽ:
- Import 40 cuốn sách từ file JSON
- Tạo 44 thể loại
- Tạo 2 tài khoản test (admin, testuser)

### 6. Chạy ứng dụng

```bash
# Chạy cả Frontend + Backend cùng lúc (khuyến nghị)
npm start
```

Hoặc chạy riêng:

```bash
# Chỉ Frontend
npm run dev

# Chỉ Backend
npm run server
```

### 7. Truy cập ứng dụng

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **API Documentation:** http://localhost:5000/api

## 🧪 Tài khoản test

Sau khi chạy `npm run seed`, bạn có thể đăng nhập với:

| Username | Password | Vai trò |
|----------|----------|---------|
| `admin` | `Admin@123` | Admin |
| `testuser` | `Test@123` | User |

## 📁 Cấu trúc project

```
eShelf/
├── backend/                 # Backend API
│   ├── config/             # Cấu hình (DB, env)
│   ├── controllers/         # Business logic
│   ├── middleware/         # Auth, error handling
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── seedData.js         # Script seed dữ liệu
│   └── server.js           # Entry point
│
├── src/                    # Frontend React
│   ├── components/         # React components
│   │   ├── auth/          # Login, Register, ForgotPassword
│   │   ├── book/           # Book components
│   │   ├── common/         # Logo, Quote
│   │   └── layout/         # Header, Footer
│   ├── context/            # React Context (Auth)
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── styles/             # Global styles
│   └── data/               # JSON data (seed)
│
├── public/                 # Static files
│   ├── images/             # Images, book covers
│   └── pdfs/               # PDF files
│
├── package.json
└── README.md
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user (protected)
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Reset mật khẩu

### Books
- `GET /api/books` - Danh sách sách
- `GET /api/books/search` - Tìm kiếm
- `GET /api/books/:isbn` - Chi tiết sách
- `GET /api/books/genres` - Danh sách thể loại
- `GET /api/books/genre/:genreName` - Sách theo thể loại

### Users
- `GET /api/users/favorites` - Sách yêu thích
- `POST /api/users/favorites/:isbn` - Thêm yêu thích
- `GET /api/users/bookmarks` - Sách đánh dấu
- `GET /api/users/reading-history` - Lịch sử đọc

### Reviews
- `GET /api/reviews/book/:isbn` - Reviews của sách
- `POST /api/reviews` - Tạo review

### Feedback & Donations
- `POST /api/feedback` - Gửi feedback
- `POST /api/donations` - Tạo donation

Xem đầy đủ API documentation tại: `http://localhost:5000/api`

## 🎨 Hình ảnh demo

![Main Page](public/demo/main.png)

![Login Page](public/demo/login-register.png)

![Search Result Page](public/demo/search-result.png)

![Book Detail Page](public/demo/book-detail.png)

![Genres Page](public/demo/genres.png)

![Donate Page](public/demo/donate.png)

![Feedback Page](public/demo/feedback.png)

## 📝 Scripts có sẵn

| Script | Mô tả |
|--------|-------|
| `npm start` | Chạy cả Frontend + Backend |
| `npm run dev` | Chỉ chạy Frontend |
| `npm run server` | Chỉ chạy Backend |
| `npm run seed` | Seed dữ liệu vào database |
| `npm run install:all` | Cài đặt dependencies cho cả 2 |
| `npm run build` | Build production |

## 🔒 Bảo mật

- Mật khẩu được hash bằng bcryptjs
- JWT token cho authentication
- CORS được cấu hình
- Input validation
- Error handling

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

ISC

## 👥 Danh sách thành viên

| MSSV     | Họ Tên      |
| -------- | :---------: |
| 23521809 | Lê Văn Vũ   |

## 📞 Liên hệ

- Email: support@eshelf.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

**Made with ❤️ for IE104 Course**
