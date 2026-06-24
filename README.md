# Fashion Website – Microservices E-commerce Platform

## Giới thiệu dự án

Fashion Website là một nền tảng thương mại điện tử hiện đại xây dựng theo kiến trúc **Microservices**. Hệ thống bao gồm giao diện khách hàng (Client), giao diện quản trị viên (Admin), và các dịch vụ backend độc lập, tách biệt rõ ràng, dễ mở rộng và bảo trì.

---

## Các tính năng chính

- **Microservices Architecture:** Hệ thống tách biệt thành các dịch vụ độc lập (User, Commerce, Search, Interaction, Notification) cho phép mở rộng theo chiều ngang (Horizontal Scaling).
- **API Gateway Pattern:** Quản lý tập trung các request, xác thực JWT, định tuyến thông minh.
- **Real-time Chat:** Giao tiếp trực tuyến thời gian thực giữa Admin và User với Socket.io.
- **Advanced Search:** Tích hợp Elasticsearch với Fuzzy Search, tìm kiếm cực nhanh.
- **Responsive UI/UX:** Giao diện hiện đại, tương thích đầy đủ trên Mobile, Tablet, Desktop.
- **Dockerization:** Toàn bộ backend được containerize, dễ dàng triển khai với một lệnh.

## Tài khoản Demo

#### **Tài khoản Admin (Full quyền)**

- **Email:** `vominhtu1212004@gmail.com`
- **Password:** `1234567`
- **Quyền:** Quản lý sản phẩm, đơn hàng, người dùng, thống kê, chat hỗ trợ

#### **Tài khoản User (Có dữ liệu mẫu)**

- **Email:** `vominhtu1@gmail.com`
- **Password:** `123456`
- **Lợi ích:** Lịch sử đơn hàng, địa chỉ, giỏ hàng

## Hướng dẫn cài đặt & chạy

#### **Yêu cầu hệ thống**

- **Node.js:** ≥ v18
- **Docker Desktop:** v4.0+
- **Git**
- **RAM:** ≥ 4GB (cho các container)

---

#### **Bước 1: Clone Repository**

```bash
git clone https://github.com/TuMinhIT/Fashion-website.git
cd Fashion-website
```

---

#### **Bước 2: Khởi chạy Backend (Microservices)**

```bash
cd fas_server
docker-compose up --build
```

**Thời gian chờ:** 2-5 phút (lần đầu tải images)

**Các service sẽ khởi động:**

- API Gateway 8000: cổng giao tiếp chính
- User Service 8001: Quản lý người dùng xác thực phân quyền.
- Commerce Service 5002: Quản lí sản phẩm, đơn hàng, vận chuyển, coupon.
- Search Service 8003: Tìm kiếm sản phẩm (Elastics search).
- Interaction Service 8004: Chat real time
- Notification Service 8005: Thông báo email
- Elasticsearch 9200 : Search Engine
- MongoDB 27017: Database (qua các service)

---

#### **Bước 3: Khởi chạy Client (Giao diện khách hàng)**

Mở terminal mới, chuyển tới thư mục client:

```bash
cd ../client
npm install
npm run dev
```

**Truy cập:** [http://localhost:5173](http://localhost:5173)

---

#### **Bước 4: Khởi chạy Admin Dashboard (Giao diện quản trị)**

Mở terminal mới, chuyển tới thư mục admin:

```bash
cd ../admin
npm install
npm run dev
```

**Truy cập:** [http://localhost:5174](http://localhost:5174)

---

## Stack Công nghệ

#### **Frontend**

- **React 19** - UI Library
- **Vite** - Build tool
- **CSS Modules / TailwindCSS** - Styling
- **React Query / Zustand** - State management
- **SocketIO Client** - Real-time communication
- **Axios** - HTTP client

#### **Backend**

- **Node.js & Express** - Server runtime & framework
- **MongoDB** - NoSQL Database (per service)
- **Elasticsearch** - Full-text search engine
- **SocketIO** - Real-time bidirectional communication
- **JWT** - Authentication & authorization
- **Bcrypt** - Password hashing
- **Docker** - Containerization

#### **DevOps**

- **Docker** - Container platform
- **Docker Compose** - Multi-container orchestration
- **Nodemon** - Development auto-restart

### **Frontend**

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Xem preview production build
npm run preview
```

### Contributors
- **Nguyễn Trung Tài (Leader):** TuMinhIT
- **Huỳnh Thị Thanh Nhung:** mthegn3003/mthegn1212
- **Lê Thị Bích My:** hoangdinh-34

### Liên hệ & Support

- **GitHub:** [github.com/TuMinhIT/Fashion-website](https://github.com/TuMinhIT/Fashion-website)
- **Email:** vominhtu1212004@gmail.com
- **Issues:** Báo cáo bug hoặc yêu cầu feature via GitHub Issues

---

## License

MIT License - Tự do sử dụng cho mục đích học tập
