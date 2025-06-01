# Báo cáo

## Chương 1. Giới thiệu bài toán và các công nghệ sử dụng

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

## Chương 2. Phân tích và thiết kế hệ thống

### 1. Phân tích hệ thống

#### 1.1. Tác nhân (Actor)

- Quản trị viên (Admin): Có quyền quản lý sân bóng, xem thống kê doanh thu.
- Nhân viên lễ tân: Thực hiện toàn bộ nghiệp vụ (quản lý sân, đặt sân, checkout, thanh toán, thống kê).
- Khách hàng: Tác nhân gián tiếp, thông qua nhân viên để đặt sân, thanh toán.

#### 1.2 Các use-case chính

- Quản lý sân bóng (thêm, sửa, xóa, tìm kiếm)
- Đặt sân (tìm sân trống, chọn khách, xác nhận đặt)
- Checkout (quản lý mặt hàng, cập nhật hóa đơn)
- Thanh toán (tính toán, cập nhật trạng thái hóa đơn, xử lý trả đủ/nợ/dư)
- Thống kê doanh thu (xem biểu đồ, bảng tổng hợp, chi tiết hóa đơn)

#### 1.3. Sơ đồ use-case chi tiết

```mermaid
%%{init: {'theme': 'default'}}%%
graph LR
    actor_KH((Khách hàng))
    actor_NV((Nhân viên))
    actor_QL((Quản lý))

    %% SUBGRAPH: ĐẶT SÂN
    subgraph Đặt sân
        UC_DatSan[Đặt sân]
        UC_InPhieu[In phiếu đặt sân]
        UC_DatSan --> UC_InPhieu
    end

    %% SUBGRAPH: MẶT HÀNG & CHECKOUT
    subgraph Cập nhật buổi thuê
        UC_CapNhatMatHang[Cập nhật mặt hàng đã dùng]
        UC_CheckOut[Check-out buổi thuê]
    end

    %% SUBGRAPH: THANH TOÁN
    subgraph Thanh toán
        UC_TraTien[Thanh toán]
        UC_NhanHoaDon[Nhận hóa đơn]
        UC_TraTien --> UC_NhanHoaDon
    end

    %% SUBGRAPH: THỐNG KÊ
    subgraph Thống kê doanh thu
        UC_XemTK[Xem thống kê doanh thu]
        UC_XemChiTietHoaDon[Xem chi tiết hóa đơn]
        UC_XemTK --> UC_XemChiTietHoaDon
    end

    %% SUBGRAPH: QUẢN LÝ SÂN BÓNG
    subgraph Quản lý sân bóng
        UC_ThemSan[Thêm sân bóng]
        UC_SuaSan[Sửa sân bóng]
        UC_XoaSan[Xoá sân bóng]
    end

    %% LIÊN KẾT
    actor_KH --> UC_DatSan
    actor_KH --> UC_TraTien
    actor_KH --> UC_NhanHoaDon

    actor_NV --> UC_DatSan
    actor_NV --> UC_CapNhatMatHang
    actor_NV --> UC_CheckOut
    actor_NV --> UC_TraTien

    actor_QL --> UC_ThemSan
    actor_QL --> UC_SuaSan
    actor_QL --> UC_XoaSan
    actor_QL --> UC_XemTK
```

#### 1.4. Kịch bản & ngoại lệ

- Đặt sân trùng giờ: cảnh báo, không cho phép đặt
- Thanh toán thiếu/dư: cập nhật trạng thái hóa đơn, hiển thị rõ trên UI
- Xóa sân bóng đang có lịch đặt: cảnh báo, không cho phép xóa

### 2. Thiết kế hệ thống

#### 2.1. Sơ đồ tuần tự

Bao gồm các luồng xử lí sau:
- Đặt sân
- Checkout và cập nhật mặt hàng đã dùng
- Thanh toán và xuất hóa đơn
- Xem thống kê doanh thu → xem chi tiết hóa đơn

#### 2.1.1 Đặt sân

```mermaid
sequenceDiagram
    participant User as Nhân viên (User)
    participant View as Frontend (React/Next.js)
    participant Controller as API Route (Express Controller)
    participant Model as Model/Database (SQLite)

    User->>View: Mở trang Đặt sân, nhập thông tin (loại sân, giờ, ngày)
    View->>Controller: GET /sanbong/trong (Tìm sân trống)
    Controller->>Model: Truy vấn sân còn trống theo giờ/ngày
    Model-->>Controller: Danh sách sân trống
    Controller-->>View: Trả về danh sách sân trống
    View-->>User: Hiển thị danh sách, chọn sân

    User->>View: Nhập/tìm thông tin khách hàng
    View->>Controller: GET /khachhang (Tìm khách hàng)
    Controller->>Model: Truy vấn khách hàng theo tên/sdt
    Model-->>Controller: Danh sách khách hàng
    Controller-->>View: Trả về danh sách khách hàng
    View-->>User: Hiển thị, chọn hoặc thêm mới khách hàng
    User->>View: Xác nhận thông tin đặt sân

    View->>Controller: POST /datsan (Gửi thông tin đặt sân)
    Controller->>Model: Tạo phiếu đặt sân, chi tiết đặt sân, tính tiền cọc
    Model-->>Controller: Kết quả tạo phiếu, chi tiết, số tiền cọc
    Controller-->>View: Trả về thông tin phiếu đặt sân, số tiền cọc
    View-->>User: Hiển thị phiếu đặt sân, thông báo thành công
```

Giải thích:
- Nhân viên thao tác trên giao diện để nhập thông tin đặt sân, tìm sân trống, tìm/chọn khách hàng.
- Frontend gửi request đến backend (API Express) để lấy dữ liệu sân trống, khách hàng, và gửi thông tin đặt sân.
- Backend xử lý logic nghiệp vụ, truy vấn/tạo dữ liệu trong SQLite, trả kết quả về frontend.
- Giao diện hiển thị kết quả đặt sân, số tiền cọc, thông báo thành công cho nhân viên.

##### 2.1.2 Checkout và cập nhật mặt hàng đã dùng

```mermaid
sequenceDiagram
    participant User as Nhân viên (User)
    participant View as Frontend (React/Next.js)
    participant Controller as API Route (Express Controller)
    participant Model as Model/Database (SQLite)

    User->>View: Chọn phiếu đặt sân, chọn hóa đơn (buổi thuê)
    View->>Controller: GET /checkout/hoadon (Lấy danh sách hóa đơn)
    Controller->>Model: Truy vấn hóa đơn theo phiếu đặt sân
    Model-->>Controller: Danh sách hóa đơn
    Controller-->>View: Trả về danh sách hóa đơn
    View-->>User: Hiển thị danh sách hóa đơn, chọn hóa đơn

    User->>View: Thêm mặt hàng đã dùng (chọn mặt hàng, nhập số lượng, giá, ngày dùng)
    View->>Controller: POST /checkout/mathang (Thêm mặt hàng đã dùng)
    Controller->>Model: Lưu mặt hàng vào chi tiết hóa đơn, cập nhật tổng tiền hóa đơn
    Model-->>Controller: Kết quả cập nhật
    Controller-->>View: Trả về hóa đơn đã cập nhật
    View-->>User: Hiển thị hóa đơn, mặt hàng đã dùng
```

Giải thích:
- Nhân viên thao tác trên giao diện để chọn phiếu đặt sân, chọn hóa đơn (buổi thuê), thêm mặt hàng đã dùng.
- Frontend gửi request đến backend (API Express) để lấy danh sách hóa đơn, thêm mặt hàng đã dùng.
- Backend xử lý logic nghiệp vụ, truy vấn/tạo dữ liệu trong SQLite, trả kết quả về frontend.
- Giao diện hiển thị kết quả hóa đơn, mặt hàng đã dùng cho nhân viên.

#### 2.1.3 Thanh toán và xuất hóa đơn

```mermaid
sequenceDiagram
    participant User as Nhân viên (User)
    participant View as Frontend (React/Next.js)
    participant Controller as API Route (Express Controller)
    participant Model as Model/Database (SQLite)

    User->>View: Chọn hóa đơn để thanh toán
    View->>Controller: GET /thanh-toan (Lấy thông tin hóa đơn)
    Controller->>Model: Truy vấn hóa đơn theo ID
    Model-->>Controller: Thông tin hóa đơn
    Controller-->>View: Trả về thông tin hóa đơn
    View-->>User: Hiển thị thông tin hóa đơn

    User->>View: Nhập số tiền khách trả
    View->>Controller: POST /thanh-toan (Gửi thông tin thanh toán)
    Controller->>Model: Cập nhật trạng thái hóa đơn, lưu thông tin thanh toán
    Model-->>Controller: Kết quả cập nhật
    Controller-->>View: Trả về thông tin hóa đơn đã thanh toán
    View-->>User: Hiển thị thông tin hóa đơn đã thanh toán
```

Giải thích:
- Nhân viên thao tác trên giao diện để chọn hóa đơn cần thanh toán, nhập số tiền khách trả.
- Frontend gửi request đến backend (API Express) để lấy thông tin hóa đơn, gửi thông tin thanh toán.
- Backend xử lý logic nghiệp vụ, truy vấn/cập nhật dữ liệu trong SQLite, trả kết quả về frontend.
- Giao diện hiển thị kết quả hóa đơn đã thanh toán cho nhân viên.

#### 2.1.4 Xem thống kê doanh thu

```mermaid
sequenceDiagram
    participant User as Nhân viên/Admin (User)
    participant View as Frontend (React/Next.js)
    participant Controller as API Route (Express Controller)
    participant Model as Model/Database (SQLite)

    User->>View: Truy cập trang Thống kê doanh thu, chọn bộ lọc (chu kỳ, năm)
    View->>Controller: GET /thongke?chuki=...&nam=... (Lấy dữ liệu doanh thu)
    Controller->>Model: Truy vấn tổng hợp doanh thu theo chu kỳ/năm
    Model-->>Controller: Dữ liệu doanh thu tổng hợp
    Controller-->>View: Trả về dữ liệu doanh thu
    View-->>User: Hiển thị biểu đồ, bảng doanh thu

    User->>View: Chọn kỳ/tháng/năm cụ thể để xem chi tiết
    View->>Controller: GET /thongke/chitiet?chuki=...&id=... (Lấy chi tiết hóa đơn)
    Controller->>Model: Truy vấn chi tiết hóa đơn theo kỳ
    Model-->>Controller: Danh sách hóa đơn chi tiết
    Controller-->>View: Trả về danh sách hóa đơn chi tiết
    View-->>User: Hiển thị bảng chi tiết hóa đơn
```

Giải thích:
- Nhân viên hoặc quản trị viên thao tác trên giao diện để chọn bộ lọc thống kê, xem biểu đồ, bảng tổng hợp doanh thu.
- Frontend gửi request đến backend (API Express) để lấy dữ liệu tổng hợp và chi tiết hóa đơn.
- Backend truy vấn dữ liệu tổng hợp/chi tiết từ SQLite, trả kết quả về frontend.
- Giao diện hiển thị biểu đồ, bảng doanh thu, chi tiết hóa đơn cho người dùng.

#### 2.1. Sơ đồ lớp

  - SanBong, KhachHang, PhieuDatSan, ChiTietDatSan, HoaDon, MatHang, ChiTietHoaDon

#### 2.2. Sơ đồ CSDL

  - Các bảng: san_bong, khach_hang, phieu_dat_san, chi_tiet_dat_san, hoa_don, mat_hang, chi_tiet_hoa_don

## Chương 3. Cài đặt và thử nghiệm hệ thống

### 3.1. Cài đặt

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
