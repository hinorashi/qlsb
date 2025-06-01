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
- **Axios:**
  - Giao tiếp API đơn giản, hỗ trợ Promise, xử lý lỗi tốt.
- **Heroicons:**
  - Bộ icon hiện đại, dễ tích hợp với React, tăng tính trực quan cho UI.

Kiến trúc tổng quan hệ thống:

```mermaid
graph LR
    User["Người dùng"]
    FE["FE <br/> (React + Next.js)"]
    BE["BE <br/> (Node.js + Express.js)"]
    DB["DB <br/> (Sqlite)"]

    User --> FE --> BE --> DB
```

## Chương 2. Phân tích và thiết kế hệ thống

### 1. Phân tích hệ thống

#### 1.1. Tác nhân (Actor)

- **Quản trị viên (Admin)**: Có quyền quản lý sân bóng, xem thống kê doanh thu.
- **Nhân viên lễ tân**: Thực hiện toàn bộ nghiệp vụ (quản lý sân, đặt sân, checkout, thanh toán, thống kê).
- **Khách hàng**: Tác nhân gián tiếp, thông qua nhân viên để đặt sân, thanh toán.

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

    %% SUBGRAPH: QUẢN LÝ SÂN BÓNG
    subgraph Quản lý sân bóng
        UC_ThemSan[Thêm sân bóng]
        UC_SuaSan[Sửa sân bóng]
        UC_XoaSan[Xoá sân bóng]
    end

    %% SUBGRAPH: ĐẶT SÂN
    subgraph Đặt sân
        UC_DatSan[Đặt sân]
        UC_ThemKhachHang[Thêm khách hàng]
        UC_InPhieu[In phiếu đặt sân]
        UC_DatSan --> UC_InPhieu
    end

    %% SUBGRAPH: CHECKOUT & CẬP NHẬT MẶT HÀNG ĐÃ DÙNG
    subgraph Checkout buổi thuê
        UC_CheckOut[Check-out buổi thuê]
        UC_CapNhatMatHang[Cập nhật mặt hàng đã dùng]
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

    %% LIÊN KẾT
    actor_QL --> UC_ThemSan
    actor_QL --> UC_SuaSan
    actor_QL --> UC_XoaSan
    actor_QL --> UC_XemTK

    actor_NV --> UC_CheckOut
    actor_NV --> UC_CapNhatMatHang
    actor_NV --> UC_ThemKhachHang
    actor_NV --> UC_DatSan
    actor_KH -. gián tiếp qua NV .-> UC_DatSan
    actor_NV --> UC_TraTien
    actor_KH -. gián tiếp qua NV .-> UC_TraTien
    actor_KH -. gián tiếp qua NV .-> UC_NhanHoaDon
```

#### 1.4. Kịch bản & ngoại lệ

_todo_

- Đặt sân trùng giờ: cảnh báo, không cho phép đặt
- Thanh toán thiếu/dư: cập nhật trạng thái hóa đơn, hiển thị rõ trên UI
- Xóa sân bóng đang có lịch đặt: cảnh báo, không cho phép xóa

#### 1.5. Cơ sở dữ liệu mức logic

Các thực thể chính trong hệ thống:

| Thực thể                    | Vai trò                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| `khach_hang`                | Người thuê sân                                                     |
| `san_bong`                  | Thông tin các sân mini/lớn                                         |
| `phieu_dat_san`             | Phiếu xác nhận đặt sân của khách hàng                              |
| `chi_tiet_dat_san`          | Một dòng đặt sân cụ thể: sân nào, khung giờ, ngày bắt đầu/kết thúc |
| `hoa_don`                   | Hóa đơn thanh toán cuối kỳ                                         |
| `mat_hang`                  | Đồ ăn, nước uống bán kèm                                           |
| `chi_tiet_su_dung_mat_hang` | Danh sách mặt hàng sử dụng mỗi buổi                                |
| `nha_cung_cap`              | Nguồn cung cấp mặt hàng                                            |
| `phieu_nhap_hang`           | Hóa đơn nhập hàng                                                  |
| `chi_tiet_phieu_nhap`       | Mặt hàng nhập cụ thể của 1 phiếu                                   |

Quan hệ giữa các thực thể:

```mermaid
erDiagram
    khach_hang ||--o{ phieu_dat_san : dat
    phieu_dat_san ||--o{ chi_tiet_dat_san : gom
    san_bong ||--o{ chi_tiet_dat_san : duoc_dat
    phieu_dat_san ||--|| hoa_don : tao_hoa_don
    hoa_don ||--o{ chi_tiet_su_dung_mat_hang : gom
    mat_hang ||--o{ chi_tiet_su_dung_mat_hang : su_dung
    nha_cung_cap ||--o{ phieu_nhap_hang : cung_cap
    phieu_nhap_hang ||--o{ chi_tiet_phieu_nhap : co
    mat_hang ||--o{ chi_tiet_phieu_nhap : duoc_nhap
```

### 2. Thiết kế hệ thống

#### 2.1. Sơ đồ tuần tự

Bao gồm các luồng xử lí sau:
- Quản lý sân bóng
- Đặt sân (_đã bao gồm luồng quản lý khách hàng_)
- Checkout và cập nhật mặt hàng đã dùng
- Thanh toán và xuất hóa đơn
- Xem thống kê doanh thu → xem chi tiết hóa đơn

#### 2.1.1. Quản lý sân bóng

```mermaid
sequenceDiagram
    actor User as Quản lý/Nhân viên (User)
    participant View as Frontend (React/Next.js)
    participant Controller as Backend API (Expressjs)
    participant Model as Model/Database (SQLite)

    User->>+View: Nhập từ khóa tìm kiếm sân bóng
    View->>+Controller: GET /sanbong?tukhoa=... (Tìm kiếm sân bóng)
    Controller->>+Model: Truy vấn danh sách sân bóng theo từ khóa
    Model-->>-Controller: Danh sách sân bóng
    Controller-->>-View: Trả về danh sách sân bóng
    View-->>-User: Hiển thị danh sách sân bóng

    User->>+View: Chọn thêm mới sân bóng, nhập thông tin
    View->>+Controller: POST /sanbong (Thêm mới sân bóng)
    Controller->>+Model: Lưu thông tin sân bóng mới
    Model-->>-Controller: Kết quả thêm mới
    Controller-->>-View: Thông báo thành công/thất bại
    View-->>-User: Hiển thị thông báo

    User->>+View: Chọn sửa sân bóng, nhập thông tin mới
    View->>+Controller: PUT /sanbong/:id (Cập nhật sân bóng)
    Controller->>+Model: Cập nhật thông tin sân bóng
    Model-->>-Controller: Kết quả cập nhật
    Controller-->>-View: Thông báo thành công/thất bại
    View-->>-User: Hiển thị thông báo

    User->>+View: Chọn xóa sân bóng
    View->>+Controller: DELETE /sanbong/:id (Xóa sân bóng)
    Controller->>+Model: Xóa sân bóng khỏi CSDL
    Model-->>-Controller: Kết quả xóa
    Controller-->>-View: Thông báo thành công/thất bại
    View-->>-User: Hiển thị thông báo
```

Giải thích:
- Quản lý hoặc nhân viên thao tác trên giao diện để tìm kiếm, thêm mới, sửa, xóa sân bóng.
- Frontend gửi request đến backend (API Express) để thực hiện các thao tác CRUD với sân bóng.
- Backend xử lý logic nghiệp vụ, truy vấn/cập nhật dữ liệu trong SQLite, trả kết quả về frontend.
- Giao diện hiển thị danh sách, thông báo kết quả thao tác cho người dùng.

#### 2.1.2. Đặt sân

```mermaid
sequenceDiagram
    actor User as Nhân viên (User)
    participant View as Frontend (React/Next.js)
    participant Controller as Backend API (Expressjs)
    participant Model as Model/Database (SQLite)

    User->>+View: Mở trang Đặt sân, nhập thông tin (loại sân, giờ, ngày)
    View->>+Controller: GET /sanbong/trong (Tìm sân trống)
    Controller->>+Model: Truy vấn sân còn trống theo giờ/ngày
    Model-->>-Controller: Danh sách sân trống
    Controller-->>-View: Trả về danh sách sân trống
    View-->>-User: Hiển thị danh sách, chọn sân

    User->>+View: Nhập/tìm thông tin khách hàng
    View->>+Controller: GET /khachhang (Tìm khách hàng)
    Controller->>+Model: Truy vấn khách hàng theo tên/sdt
    Model-->>-Controller: Danh sách khách hàng
    Controller-->>-View: Trả về danh sách khách hàng
    View-->>-User: Hiển thị, chọn hoặc thêm mới khách hàng
    User->>+View: Xác nhận thông tin đặt sân

    View->>+Controller: POST /datsan (Gửi thông tin đặt sân)
    Controller->>+Model: Tạo phiếu đặt sân, chi tiết đặt sân, tính tiền cọc
    Model-->>-Controller: Kết quả tạo phiếu, chi tiết, số tiền cọc
    Controller-->>-View: Trả về thông tin phiếu đặt sân, số tiền cọc
    View-->>-User: Hiển thị phiếu đặt sân, thông báo thành công
```

Giải thích:
- Nhân viên thao tác trên giao diện để nhập thông tin đặt sân, tìm sân trống, tìm/chọn khách hàng.
- Frontend gửi request đến backend (API Express) để lấy dữ liệu sân trống, khách hàng, và gửi thông tin đặt sân.
- Backend xử lý logic nghiệp vụ, truy vấn/tạo dữ liệu trong SQLite, trả kết quả về frontend.
- Giao diện hiển thị kết quả đặt sân, số tiền cọc, thông báo thành công cho nhân viên.

##### 2.1.3. Checkout và cập nhật mặt hàng đã dùng

```mermaid
sequenceDiagram
    actor User as Nhân viên (User)
    participant View as Frontend (React/Next.js)
    participant Controller as Backend API (Expressjs)
    participant Model as Model/Database (SQLite)

    User->>+View: Chọn phiếu đặt sân, chọn hóa đơn (buổi thuê)
    View->>+Controller: GET /checkout/hoadon (Lấy danh sách hóa đơn)
    Controller->>+Model: Truy vấn hóa đơn theo phiếu đặt sân
    Model-->>-Controller: Danh sách hóa đơn
    Controller-->>-View: Trả về danh sách hóa đơn
    View-->>-User: Hiển thị danh sách hóa đơn, chọn hóa đơn

    User->>+View: Thêm mặt hàng đã dùng (chọn mặt hàng, nhập số lượng, giá, ngày dùng)
    View->>+Controller: POST /checkout/mathang (Thêm mặt hàng đã dùng)
    Controller->>+Model: Lưu mặt hàng vào chi tiết hóa đơn, cập nhật tổng tiền hóa đơn
    Model-->>-Controller: Kết quả cập nhật
    Controller-->>-View: Trả về hóa đơn đã cập nhật
    View-->>-User: Hiển thị hóa đơn, mặt hàng đã dùng
```

Giải thích:
- Nhân viên thao tác trên giao diện để chọn phiếu đặt sân, chọn hóa đơn (buổi thuê), thêm mặt hàng đã dùng.
- Frontend gửi request đến backend (API Express) để lấy danh sách hóa đơn, thêm mặt hàng đã dùng.
- Backend xử lý logic nghiệp vụ, truy vấn/tạo dữ liệu trong SQLite, trả kết quả về frontend.
- Giao diện hiển thị kết quả hóa đơn, mặt hàng đã dùng cho nhân viên.

#### 2.1.4. Thanh toán và xuất hóa đơn

```mermaid
sequenceDiagram
    actor User as Nhân viên (User)
    participant View as Frontend (React/Next.js)
    participant Controller as Backend API (Expressjs)
    participant Model as Model/Database (SQLite)

    User->>+View: Chọn hóa đơn để thanh toán
    View->>+Controller: GET /thanh-toan (Lấy thông tin hóa đơn)
    Controller->>+Model: Truy vấn hóa đơn theo ID
    Model-->>-Controller: Thông tin hóa đơn
    Controller-->>-View: Trả về thông tin hóa đơn
    View-->>-User: Hiển thị thông tin hóa đơn

    User->>+View: Nhập số tiền khách trả
    View->>+Controller: POST /thanh-toan (Gửi thông tin thanh toán)
    Controller->>+Model: Cập nhật trạng thái hóa đơn, lưu thông tin thanh toán
    Model-->>-Controller: Kết quả cập nhật
    Controller-->>-View: Trả về thông tin hóa đơn đã thanh toán
    View-->>-User: Hiển thị thông tin hóa đơn đã thanh toán
```

Giải thích:
- Nhân viên thao tác trên giao diện để chọn hóa đơn cần thanh toán, nhập số tiền khách trả.
- Frontend gửi request đến backend (API Express) để lấy thông tin hóa đơn, gửi thông tin thanh toán.
- Backend xử lý logic nghiệp vụ, truy vấn/cập nhật dữ liệu trong SQLite, trả kết quả về frontend.
- Giao diện hiển thị kết quả hóa đơn đã thanh toán cho nhân viên.

#### 2.1.5. Xem thống kê doanh thu

```mermaid
sequenceDiagram
    actor User as Nhân viên/Admin (User)
    participant View as Frontend (React/Next.js)
    participant Controller as Backend API (Expressjs)
    participant Model as Model/Database (SQLite)

    User->>+View: Truy cập trang Thống kê doanh thu, chọn bộ lọc (chu kỳ, năm)
    View->>+Controller: GET /thongke?chuki=...&nam=... (Lấy dữ liệu doanh thu)
    Controller->>+Model: Truy vấn tổng hợp doanh thu theo chu kỳ/năm
    Model-->>-Controller: Dữ liệu doanh thu tổng hợp
    Controller-->>-View: Trả về dữ liệu doanh thu
    View-->>-User: Hiển thị biểu đồ, bảng doanh thu

    User->>+View: Chọn kỳ/tháng/năm cụ thể để xem chi tiết
    View->>+Controller: GET /thongke/chitiet?chuki=...&id=... (Lấy chi tiết hóa đơn)
    Controller->>+Model: Truy vấn chi tiết hóa đơn theo kỳ
    Model-->>-Controller: Danh sách hóa đơn chi tiết
    Controller-->>-View: Trả về danh sách hóa đơn chi tiết
    View-->>-User: Hiển thị bảng chi tiết hóa đơn
```

Giải thích:
- Nhân viên hoặc quản trị viên thao tác trên giao diện để chọn bộ lọc thống kê, xem biểu đồ, bảng tổng hợp doanh thu.
- Frontend gửi request đến backend (API Express) để lấy dữ liệu tổng hợp và chi tiết hóa đơn.
- Backend truy vấn dữ liệu tổng hợp/chi tiết từ SQLite, trả kết quả về frontend.
- Giao diện hiển thị biểu đồ, bảng doanh thu, chi tiết hóa đơn cho người dùng.

#### 2.1. Sơ đồ lớp

```mermaid
classDiagram
    class SanBong {
        +id: int
        +ten_san: string
        +loai_san: string
        +mo_ta: string
        +gia_thue_theo_gio: float
    }

    class KhachHang {
        +id: int
        +ho_ten: string
        +sdt: string
        +email: string
    }

    class NhaCungCap {
        +id: int
        +ten: string
        +dia_chi: string
        +email: string
        +dien_thoai: string
        +mo_ta: string
    }

    class MatHang {
        +id: int
        +ten: string
        +don_vi: string
        +gia_ban: float
    }

    class PhieuDatSan {
        +id: int
        +khach_hang_id: int
        +ngay_dat: date
        +tong_tien_du_kien: float
        +tien_dat_coc: float
    }

    class ChiTietDatSan {
        +id: int
        +phieu_dat_san_id: int
        +san_bong_id: int
        +gio_bat_dau: string
        +gio_ket_thuc: string
        +ngay_bat_dau: date
        +ngay_ket_thuc: date
        +gia_thue_theo_gio: float
        +gio_nhan_san: string
        +gio_tra_san: string
    }

    class HoaDon {
        +id: int
        +phieu_dat_san_id: int
        +ngay_thanh_toan: date
        +tong_tien: float
        +tien_thue_san: float
        +so_tien_thuc_tra: float
        +so_tien_con_lai: float
    }

    class ChiTietSuDungMatHang {
        +id: int
        +hoa_don_id: int
        +ngay_su_dung: date
        +mat_hang_id: int
        +so_luong: int
        +gia_ban: float
        +thanh_tien: float
    }

    class PhieuNhapHang {
        +id: int
        +nha_cung_cap_id: int
        +ngay_nhap: date
    }

    class ChiTietPhieuNhap {
        +id: int
        +phieu_nhap_hang_id: int
        +mat_hang_id: int
        +so_luong: int
        +don_gia: float
        +thanh_tien: float
    }

    KhachHang "1" --o "0..*" PhieuDatSan
    PhieuDatSan "1" --o "1..*" ChiTietDatSan
    SanBong "1" --o "0..*" ChiTietDatSan
    PhieuDatSan "1" --o "0..1" HoaDon
    HoaDon "1" --o "0..*" ChiTietSuDungMatHang
    MatHang "1" --o "0..*" ChiTietSuDungMatHang
    NhaCungCap "1" --o "0..*" PhieuNhapHang
    PhieuNhapHang "1" --o "0..*" ChiTietPhieuNhap
    MatHang "1" --o "0..*" ChiTietPhieuNhap
```

Các lớp trong hệ thống được thiết kế như sau:

- **SanBong**: Đại diện cho bảng `san_bong` (id, ten_san, loai_san, mo_ta, gia_thue_theo_gio).
- **KhachHang**: Đại diện cho bảng `khach_hang` (id, ho_ten, sdt, email).
- **PhieuDatSan**: Đại diện cho bảng `phieu_dat_san` (id, khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc).
- **ChiTietDatSan**: Đại diện cho bảng `chi_tiet_dat_san` (id, phieu_dat_san_id, san_bong_id, gio_bat_dau, gio_ket_thuc, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio, gio_nhan_san, gio_tra_san).
- **HoaDon**: Đại diện cho bảng `hoa_don` (id, phieu_dat_san_id, ngay_thanh_toan, tong_tien, tien_thue_san, so_tien_thuc_tra, so_tien_con_lai).
- **MatHang**: Đại diện cho bảng `mat_hang` (id, ten, don_vi, gia_ban).
- **ChiTietSuDungMatHang**: Đại diện cho bảng `chi_tiet_su_dung_mat_hang` (id, hoa_don_id, ngay_su_dung, mat_hang_id, so_luong, gia_ban, thanh_tien).
- **NhaCungCap**: Đại diện cho bảng `nha_cung_cap` (id, ten, dia_chi, email, dien_thoai, mo_ta).
- **PhieuNhapHang**: Đại diện cho bảng `phieu_nhap_hang` (id, nha_cung_cap_id, ngay_nhap).
- **ChiTietPhieuNhap**: Đại diện cho bảng `chi_tiet_phieu_nhap` (id, phieu_nhap_hang_id, mat_hang_id, so_luong, don_gia, thanh_tien).

Quan hệ giữa các lớp/bảng:
- Mỗi khách hàng (`KhachHang`) có thể có nhiều phiếu đặt sân (`PhieuDatSan`).
- Mỗi phiếu đặt sân có nhiều chi tiết đặt sân (`ChiTietDatSan`), mỗi chi tiết liên kết với một sân bóng (`SanBong`).
- Mỗi phiếu đặt sân có thể sinh ra một hóa đơn (`HoaDon`).
- Mỗi hóa đơn có nhiều chi tiết sử dụng mặt hàng (`ChiTietSuDungMatHang`), mỗi chi tiết liên kết với một mặt hàng (`MatHang`).
- Mỗi mặt hàng có thể xuất hiện trong nhiều phiếu nhập hàng (`ChiTietPhieuNhap`), mỗi phiếu nhập hàng thuộc về một nhà cung cấp (`NhaCungCap`).

#### 2.2. Sơ đồ CSDL

Mô tả chi tiết các bảng, trường và quan hệ:

- **khach_hang**: Lưu thông tin khách hàng (id, ho_ten, sdt, email).
- **san_bong**: Thông tin các sân bóng (id, ten_san, loai_san, mo_ta, gia_thue_theo_gio).
- **phieu_dat_san**: Phiếu xác nhận đặt sân của khách hàng (id, khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc).
- **chi_tiet_dat_san**: Chi tiết từng lần đặt sân (id, phieu_dat_san_id, san_bong_id, gio_bat_dau, gio_ket_thuc, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio, gio_nhan_san, gio_tra_san).
- **hoa_don**: Hóa đơn thanh toán (id, phieu_dat_san_id, ngay_thanh_toan, tong_tien, tien_thue_san, so_tien_thuc_tra, so_tien_con_lai).
- **mat_hang**: Đồ ăn, nước uống bán kèm (id, ten, don_vi, gia_ban).
- **chi_tiet_su_dung_mat_hang**: Danh sách mặt hàng sử dụng mỗi buổi (id, hoa_don_id, ngay_su_dung, mat_hang_id, so_luong, gia_ban, thanh_tien).
- **nha_cung_cap**: Nguồn cung cấp mặt hàng (id, ten, dia_chi, email, dien_thoai, mo_ta).
- **phieu_nhap_hang**: Hóa đơn nhập hàng (id, nha_cung_cap_id, ngay_nhap).
- **chi_tiet_phieu_nhap**: Mặt hàng nhập cụ thể của 1 phiếu (id, phieu_nhap_hang_id, mat_hang_id, so_luong, don_gia, thanh_tien).

Các ràng buộc khóa ngoại (FOREIGN KEY) đảm bảo tính toàn vẹn dữ liệu giữa các bảng:
- `phieu_dat_san.khach_hang_id` → `khach_hang.id`
- `chi_tiet_dat_san.phieu_dat_san_id` → `phieu_dat_san.id`
- `chi_tiet_dat_san.san_bong_id` → `san_bong.id`
- `hoa_don.phieu_dat_san_id` → `phieu_dat_san.id`
- `chi_tiet_su_dung_mat_hang.hoa_don_id` → `hoa_don.id`
- `chi_tiet_su_dung_mat_hang.mat_hang_id` → `mat_hang.id`
- `phieu_nhap_hang.nha_cung_cap_id` → `nha_cung_cap.id`
- `chi_tiet_phieu_nhap.phieu_nhap_hang_id` → `phieu_nhap_hang.id`
- `chi_tiet_phieu_nhap.mat_hang_id` → `mat_hang.id`

Sơ đồ ERD chi tiết:

```mermaid
erDiagram
    khach_hang {
        INT id PK
        STRING ho_ten
        STRING sdt
        STRING email
    }

    san_bong {
        INT id PK
        STRING ten_san
        STRING loai_san
        STRING mo_ta
        FLOAT gia_thue_theo_gio
    }

    phieu_dat_san {
        INT id PK
        INT khach_hang_id FK
        DATE ngay_dat
        FLOAT tong_tien_du_kien
        FLOAT tien_dat_coc
    }

    chi_tiet_dat_san {
        INT id PK
        INT phieu_dat_san_id FK
        INT san_bong_id FK
        TIME gio_bat_dau
        TIME gio_ket_thuc
        DATE ngay_bat_dau
        DATE ngay_ket_thuc
        TIME gio_nhan_san
        TIME gio_tra_san
        FLOAT gia_thue_theo_gio
    }

    hoa_don {
        INT id PK
        INT phieu_dat_san_id FK
        DATE ngay_thanh_toan
        FLOAT tong_tien
        FLOAT tien_thue_san
        FLOAT so_tien_thuc_tra
        FLOAT so_tien_con_lai
    }

    mat_hang {
        INT id PK
        STRING ten
        STRING don_vi
        FLOAT gia_ban
    }

    chi_tiet_su_dung_mat_hang {
        INT id PK
        INT hoa_don_id FK
        DATE ngay_su_dung
        INT mat_hang_id FK
        INT so_luong
        FLOAT gia_ban
        FLOAT thanh_tien
    }

    nha_cung_cap {
        INT id PK
        STRING ten
        STRING dia_chi
        STRING email
        STRING dien_thoai
        STRING mo_ta
    }

    phieu_nhap_hang {
        INT id PK
        INT nha_cung_cap_id FK
        DATE ngay_nhap
    }

    chi_tiet_phieu_nhap {
        INT id PK
        INT phieu_nhap_hang_id FK
        INT mat_hang_id FK
        INT so_luong
        FLOAT don_gia
        FLOAT thanh_tien
    }

    khach_hang ||--o{ phieu_dat_san : dat
    phieu_dat_san ||--o{ chi_tiet_dat_san : gom
    san_bong ||--o{ chi_tiet_dat_san : duoc_dat
    phieu_dat_san ||--|| hoa_don : tao_hoa_don
    hoa_don ||--o{ chi_tiet_su_dung_mat_hang : gom
    mat_hang ||--o{ chi_tiet_su_dung_mat_hang : su_dung
    nha_cung_cap ||--o{ phieu_nhap_hang : cung_cap
    phieu_nhap_hang ||--o{ chi_tiet_phieu_nhap : co
    mat_hang ||--o{ chi_tiet_phieu_nhap : duoc_nhap
```

## Chương 3. Cài đặt và thử nghiệm hệ thống

### 3.1. Cài đặt

#### 3.1.1. Chuẩn bị môi trường

- Cài đặt Node.js (phiên bản >= 14)
- Cài đặt SQLite (phiên bản >= 3.31)
- Cài đặt Git để clone source code
- Cài đặt curl để thử nghiệm API

#### 3.1.2. Cơ sở dữ liệu

Tạo CSDL SQLite: tạo file `db/qlsb.db` bằng lệnh sau:
```bash
sqlite3 db/qlsb.db < db/schema.sql
```

Khởi tạo dữ liệu mẫu:
```bash
sqlite3 db/qlsb.db < db/seed.sql
```

#### 3.1.3. Backend

- Vào thư mục backend: `cd backend`
- Cài dependencies: `npm install` trong thư mục backend
- Khởi động server: `npm run dev` (port mặc định 5000)

#### Frontend

- Vào thư mục frontend: `cd frontend`
- Cài dependencies: `npm install` trong thư mục frontend
- Chạy: `npm run dev` (port mặc định 3000)
- Truy cập giao diện: `http://localhost:3000`

### 3.2. Thử nghiệm

#### 3.2.1. Cơ sở dữ liệu

Truy cập CSDL SQLite để kiểm tra dữ liệu:
```bash
sqlite3 db/qlsb.db
```

Thực hiện các truy vấn SQL để kiểm tra dữ liệu.

#### 3.2.2. Backend

- Thử nghiệm API bằng curl:
  - GET/POST/PUT/DELETE các route `/sanbong`, `/datsan`, `/checkout`, `/thanh-toan`, `/thongke`
  - Ví dụ: `curl http://localhost:3001/api/sanbong`

#### Frontend

- Truy cập giao diện web tại `http://localhost:3000`, thực hiện các tính năng:
  - Tìm kiếm sân bóng, thêm/sửa/xóa sân
  - Đặt sân, chọn khách hàng, xác nhận đặt
  - Checkout mặt hàng đã dùng, cập nhật hóa đơn
  - Thanh toán hóa đơn, nhập số tiền khách trả
  - Xem thống kê doanh thu, chi tiết hóa đơn

- Hoặc truy cập trực tiếp các trang:
  - `/san-bong`: Quản lý sân bóng (thêm, sửa, xóa, tìm kiếm)
  - `/dat-san`: Đặt sân (tìm sân trống, chọn khách, xác nhận đặt)
  - `/checkout`: Quản lý mặt hàng, cập nhật hóa đơn
  - `/thanh-toan`: Thanh toán hóa đơn, nhập số tiền khách trả, xem trạng thái thanh toán
  - `/thong-ke`: Thống kê doanh thu, xem biểu đồ, bảng tổng hợp, chi tiết hóa đơn

- Kiểm thử các trường hợp bổ sung:
  - Đặt sân trùng giờ, đặt nhiều ngày, đặt cho khách mới/cũ
  - Thêm/xóa/sửa mặt hàng khi checkout
  - Thanh toán thiếu/dư, kiểm tra trạng thái hóa đơn
  - Xem thống kê doanh thu theo tháng/năm, xem chi tiết hóa đơn
