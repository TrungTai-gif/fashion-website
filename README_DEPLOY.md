# Hướng dẫn Triển khai (Deploy) Hệ thống Microservices lên Microsoft Azure

Hệ thống của bạn bao gồm 3 phần chính:
1. **Backend (Microservices):** Chạy bằng Docker Compose (Node.js, MongoDB, Elasticsearch, RabbitMQ).
2. **Client (Người dùng):** ReactJS.
3. **Admin (Quản trị):** ReactJS.

Phương án tối ưu và tiết kiệm nhất trên Azure cho cấu trúc này là:
- **Backend:** Triển khai trên **Azure Virtual Machine (VM) - Ubuntu** (Lift & Shift với Docker Compose).
- **Frontend (Client & Admin):** Triển khai trên **Azure Static Web Apps** (Miễn phí, tự động hóa với GitHub Actions).

---

## Phần 1: Triển khai Backend (Microservices) lên Azure Virtual Machine

### Bước 1: Tạo máy chủ ảo (VM) trên Azure
1. Đăng nhập vào [Azure Portal](https://portal.azure.com/).
2. Tìm kiếm **Virtual Machines** -> Nhấn **Create** -> **Azure Virtual Machine**.
3. Cấu hình cơ bản:
   - **Image:** Chọn `Ubuntu Server 22.04 LTS`.
   - **Size:** Tối thiểu nên chọn `Standard_B2s` (2 vCPU, 4GB RAM) để đủ tài nguyên chạy Elasticsearch và RabbitMQ.
   - **Authentication type:** Chọn `SSH public key` hoặc `Password` để truy cập.
4. Ở tab **Networking**, mở các cổng (Inbound port rules):
   - `22` (SSH)
   - `80` (HTTP)
   - `8000` (API Gateway - cổng giao tiếp với Frontend)
5. Nhấn **Review + create** để tạo VM.

### Bước 2: Cài đặt Docker & Docker Compose trên VM
1. Kết nối (SSH) vào VM thông qua địa chỉ Public IP của máy ảo:
   ```bash
   ssh username@<VM_PUBLIC_IP>
   ```
2. Cạy các lệnh sau để cài đặt Docker:
   ```bash
   sudo apt update
   sudo apt install docker.io -y
   sudo systemctl enable --now docker
   sudo usermod -aG docker $USER
   ```
3. Cài đặt Docker Compose:
   ```bash
   sudo apt install docker-compose-v2 -y
   ```

### Bước 3: Đưa mã nguồn Backend lên VM
Bạn có thể dùng `git clone` hoặc dùng lệnh `scp` để copy thư mục `fas_server` từ máy tính lên VM.
```bash
# Lệnh copy từ máy cá nhân lên VM
scp -r ./fas_server username@<VM_PUBLIC_IP>:~/fas_server
```

### Bước 4: Cấu hình biến môi trường (.env) cho Production
1. Vào thư mục `fas_server` trên VM:
   ```bash
   cd ~/fas_server
   ```
2. Đảm bảo bạn đã cấu hình đầy đủ các file `.env` cho từng service.
3. **Quan trọng:** Trong file cấu hình của Frontend sau này, thay vì gọi `localhost:8000`, bạn sẽ phải gọi tới `http://<VM_PUBLIC_IP>:8000`. Hãy thiết lập CORS trong `api_gateway` để cho phép domain của frontend gọi tới.

### Bước 5: Chạy hệ thống
1. Build và khởi chạy các container dưới nền (detached mode):
   ```bash
   docker compose up -d --build
   ```
2. Kiểm tra trạng thái các container:
   ```bash
   docker compose ps
   ```
   *(Đảm bảo api_gateway, elasticsearch, rabbitmq và các services đều đang trạng thái Up).*
3. Kiểm tra API: Mở trình duyệt truy cập `http://<VM_PUBLIC_IP>:8000` để xem API Gateway đã hoạt động chưa.

---

## Phần 2: Triển khai Frontend (Client & Admin) lên Azure Static Web Apps

### Bước 1: Chuẩn bị mã nguồn
1. Đảm bảo mã nguồn `client` và `admin` đã được đẩy (push) lên một kho lưu trữ **GitHub**.
2. Trong thư mục `client`, sửa file `.env` (nếu có) hoặc thay thế các cấu hình URL gọi API:
   ```env
   VITE_API_URL=http://<VM_PUBLIC_IP>:8000
   ```
   *(Làm tương tự với phần `admin`).*

### Bước 2: Tạo Azure Static Web App cho Client
1. Trên Azure Portal, tìm **Static Web Apps** -> Nhấn **Create**.
2. Cấu hình cơ bản:
   - **Hosting plan type:** Chọn `Free` (Dành cho cá nhân/thử nghiệm).
   - **Deployment details:** Chọn **GitHub** và đăng nhập để liên kết tài khoản.
3. Chọn Repository và Branch chứa mã nguồn trang `client`.
4. Ở phần **Build Details**:
   - **Build Presets:** Chọn `React`.
   - **App location:** `/client` (Đường dẫn tới thư mục client trong repo của bạn).
   - **Api location:** Để trống.
   - **Output location:** `dist` (Thư mục build mặc định của Vite/React).
5. Nhấn **Review + create**. Azure sẽ tự động tạo một workflow GitHub Actions để build và deploy trang web của bạn mỗi khi bạn push code mới.

### Bước 3: Tạo Azure Static Web App cho Admin
Thực hiện lại hoàn toàn các bước ở **Bước 2**, nhưng thay đổi **App location** thành `/admin` để trỏ tới thư mục của Admin Dashboard.

---

## Phần 3: Trỏ tên miền (Tùy chọn)
1. **Frontend:** Trong Azure Static Web Apps, chọn mục **Custom domains** để thêm tên miền tùy chỉnh (ví dụ: `fitme.vn`).
2. **Backend:** Trong trang quản lý DNS của tên miền, tạo một bản ghi `A` trỏ tên miền phụ (ví dụ: `api.fitme.vn`) về địa chỉ `<VM_PUBLIC_IP>` của máy ảo chứa Backend. 
*(Lưu ý: Nếu dùng tên miền `api.fitme.vn`, hãy cài đặt Nginx và Let's Encrypt (Certbot) trên VM làm Reverse Proxy để có chứng chỉ SSL `https`).*

---
**Chúc mừng! Bạn đã triển khai thành công hệ thống Microservices lên Microsoft Azure.**
