# Báo cáo

## I. Giới thiệu bài toán và các công nghệ sử dụng

Hệ thống quản lý cho thuê sân bóng mini giúp tự động hóa quy trình đặt sân, thanh toán, quản lý khách hàng, thống kê doanh thu. Hệ thống gồm backend (Node.js, Express, SQLite) và frontend (Next.js, React, TailwindCSS). Giao diện hiện đại, đồng bộ, tập trung vào trải nghiệm người dùng và logic nghiệp vụ thanh toán.

**Công nghệ sử dụng:**
- Backend: Node.js, Express, SQLite
- Frontend: Next.js, React, TailwindCSS
- Thư viện phụ trợ: Heroicons, Axios

**Giải thích các công nghệ sử dụng và ưu điểm:**
- **Node.js & Express (Backend):**
  - Xử lý bất đồng bộ tốt, phù hợp cho ứng dụng realtime, API RESTful.
  - Cộng đồng lớn, nhiều thư viện hỗ trợ, dễ mở rộng.
  - Express giúp tổ chức route, middleware rõ ràng, dễ bảo trì.
- **SQLite (Cơ sở dữ liệu):**
  - Nhẹ, dễ triển khai, không cần cài đặt server riêng.
  - Phù hợp cho ứng dụng vừa/nhỏ, phát triển nhanh, backup đơn giản.
- **Next.js & React (Frontend):**
  - Next.js hỗ trợ SSR, tối ưu SEO, tốc độ tải trang nhanh.
  - React component hóa UI, dễ tái sử dụng, phát triển nhanh.
  - Hỗ trợ hot reload, phát triển giao diện hiện đại, linh hoạt.
- **TailwindCSS:**
  - Thiết kế giao diện nhanh, đồng bộ, responsive, dễ tùy biến theme.
  - Giảm code CSS lặp lại, tối ưu hiệu suất frontend.
- **Heroicons:**
  - Bộ icon hiện đại, dễ tích hợp với React, tăng tính trực quan cho UI.
- **Axios:**
  - Giao tiếp API đơn giản, hỗ trợ Promise, xử lý lỗi tốt.

## II. Phân tích và thiết kế hệ thống

### 1. Phân tích hệ thống

**Tác nhân:**
- Quản trị viên (Admin)
- Nhân viên lễ tân
- Khách hàng (gián tiếp qua nhân viên)

**Các use-case chính:**
- Quản lý sân bóng (thêm, sửa, xóa, tìm kiếm)
- Đặt sân (tìm sân trống, chọn khách, xác nhận đặt)
- Checkout (quản lý mặt hàng, cập nhật hóa đơn)
- Thanh toán (tính toán, cập nhật trạng thái hóa đơn, xử lý trả đủ/nợ/dư)
- Thống kê doanh thu (xem biểu đồ, bảng tổng hợp, chi tiết hóa đơn)

**Kịch bản & ngoại lệ:**
- Đặt sân trùng giờ: cảnh báo, không cho phép đặt
- Thanh toán thiếu/dư: cập nhật trạng thái hóa đơn, hiển thị rõ trên UI
- Xóa sân bóng đang có lịch đặt: cảnh báo, không cho phép xóa

### 2. Thiết kế hệ thống

- **Sơ đồ tuần tự:**
  1. Nhân viên tìm sân trống → chọn khách → xác nhận đặt sân → sinh phiếu đặt sân, chi tiết đặt sân.
  2. Khi khách đến, nhân viên tìm phiếu → chọn hóa đơn → thêm mặt hàng đã dùng → cập nhật tổng tiền.
  3. Khi thanh toán, nhân viên nhập số tiền khách trả → hệ thống tính trạng thái (đủ/nợ/dư), cập nhật hóa đơn.
- **Sơ đồ lớp:**
  - SanBong, KhachHang, PhieuDatSan, ChiTietDatSan, HoaDon, MatHang, ChiTietHoaDon
- **Sơ đồ CSDL:**
  - Các bảng: san_bong, khach_hang, phieu_dat_san, chi_tiet_dat_san, hoa_don, mat_hang, chi_tiet_hoa_don

## III. Cài đặt và thử nghiệm hệ thống

### 1. Cài đặt

#### Backend
- Cài Node.js, clone source code
- Cài dependencies: `npm install` trong thư mục backend
- Khởi động server: `npm start` (port mặc định 3001)
- CSDL SQLite: file `db/qlsb.db`, có sẵn script tạo bảng và seed dữ liệu

#### Frontend
- Cài Node.js, clone source code
- Cài dependencies: `npm install` trong thư mục frontend
- Chạy: `npm run dev` (port mặc định 3000)
- Cài thêm: `npm install @heroicons/react` để hiển thị icon

### 2. Thử nghiệm

#### Backend
- Thử nghiệm API bằng curl hoặc Postman:
  - GET/POST/PUT/DELETE các route `/sanbong`, `/datsan`, `/checkout`, `/thanh-toan`, `/thongke`
  - Ví dụ: `curl http://localhost:3001/api/sanbong`

#### Frontend
- Truy cập các trang:
  - `/san-bong`: Quản lý sân bóng (thêm, sửa, xóa, tìm kiếm)
  - `/dat-san`: Đặt sân (tìm sân trống, chọn khách, xác nhận đặt)
  - `/checkout`: Quản lý mặt hàng, cập nhật hóa đơn
  - `/thanh-toan`: Thanh toán hóa đơn, nhập số tiền khách trả, xem trạng thái thanh toán
  - `/thong-ke`: Thống kê doanh thu, xem biểu đồ, bảng tổng hợp, chi tiết hóa đơn
- Kiểm thử các trường hợp:
  - Đặt sân trùng giờ, đặt nhiều ngày, đặt cho khách mới/cũ
  - Thêm/xóa/sửa mặt hàng khi checkout
  - Thanh toán thiếu/dư, kiểm tra trạng thái hóa đơn
  - Xem thống kê doanh thu theo tháng/năm, xem chi tiết hóa đơn

---

**Ghi chú:**
- Giao diện đã được chuẩn hóa, đồng bộ layout, tối ưu trải nghiệm người dùng.
- Logic nghiệp vụ thanh toán, đồng bộ dữ liệu, reload sau thao tác đã được kiểm thử kỹ.
- Có thể mở rộng thêm các chức năng quản lý nhân viên, phân quyền, xuất báo cáo PDF, v.v.
