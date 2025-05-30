# Backend với ExpressJS

## I. Cài đặt

```sh
npm init -y
npm install express sqlite3 cors
```

## II. Cấu trúc thư mục

```psql
db/
├── seed.sql              # Dữ liệu mẫu
├── schema.sql            # Cấu trúc CSDL
├── clean.sql             # Reset CSDL
backend/
├── src/
│   ├── database.js       # Kết nối SQLite
│   ├── routes/
│   │   └── thongke.js    # API thống kê
│   └── server.js         # Main entry point
```

## III. Chạy server

```sh
node server.js
```

## IV. Test API

### 1. Thống kê doanh thu

```sh
# Thống kê doanh thu theo tháng trong năm 2025
GET http://localhost:3000/api/thong-ke?type=thang&nam=2025
# Chi tiết doanh thu theo tháng trong năm 2025
GET http://localhost:3000/api/thong-ke/chi-tiet?type=thang&thoigian=2025-04
```

Thống kê theo kì:
- Theo tháng: http://localhost:3000/api/thong-ke?type=thang&nam=2025
- Theo quý: http://localhost:3000/api/thong-ke?type=quy&nam=2025
- Theo năm: http://localhost:3000/api/thong-ke?type=nam&nam=2025

Chi tiết hóa đơn trong kì:
- Theo tháng: http://localhost:3000/api/thong-ke/chi-tiet?type=thang&thoigian=2025-04
- Theo quý: http://localhost:3000/api/thong-ke/chi-tiet?type=quy&thoigian=2025-Q2
- Theo năm: http://localhost:3000/api/thong-ke/chi-tiet?type=nam&thoigian=2025

### 2. Quản lí sân bóng

🔍 Tìm kiếm sân bóng theo tên:
```sh
curl -s "http://localhost:5000/api/san-bong" | jq
curl -s "http://localhost:5000/api/san-bong?tukhoa=A1" | jq
```

🧾 Xem chi tiết sân bóng theo ID:
```sh
curl -s "http://localhost:5000/api/san-bong/1" | jq
```

➕ Thêm mới sân bóng:
```sh
curl -sX POST "http://localhost:5000/api/san-bong" \
  -H "Content-Type: application/json" \
  -d '{"ten_san":"Sân B1","loai_san":"11 người","mo_ta":"Sân lớn phía Nam"}' | jq
```

✏️ Cập nhật thông tin sân bóng:
```sh
curl -sX PUT "http://localhost:5000/api/san-bong/3" \
  -H "Content-Type: application/json" \
  -d '{"ten_san":"Sân B1 sửa","loai_san":"mini","mo_ta":"Đã sửa mô tả lần nữa"}' | jq
```
    
❌ Xóa sân bóng:
```sh
curl -sX DELETE "http://localhost:5000/api/san-bong/3" | jq
```

### 3. Đặt sân

Các API liên quan đến đặt sân:
- `GET /api/dat-san/san-trong`: Tìm sân trống theo loại sân, khung giờ, ngày bắt đầu/kết thúc.
- `GET /api/dat-san/khach-hang`: Tìm khách hàng theo tên (fuzzy).
- `POST /api/dat-san/khach-hang`: Thêm mới khách hàng.
- `POST /api/dat-san/phieu-dat-san`: Lưu phiếu đặt sân.
- `POST /api/dat-san/chi-tiet-dat-san`: Lưu chi tiết đặt sân.
- `GET /api/dat-san/chi-tiet-dat-san/:id/tinh-tien`: Tính tổng số buổi và tổng tiền dự kiến cho 1 chi tiết đặt sân.
- `GET /api/dat-san/phieu-dat-san/:id`: Lấy thông tin phiếu đặt sân (chi tiết).

#### Tìm sân trống theo loại sân, khung giờ, ngày bắt đầu/kết thúc

```sh
curl -s "http://localhost:5000/api/dat-san/san-trong?loai_san=mini&khung_gio=18:00-20:00&ngay_bat_dau=2025-06-01&ngay_ket_thuc=2025-06-01" | jq
```

#### Tìm khách hàng theo tên (fuzzy)

```sh
curl -s "http://localhost:5000/api/dat-san/khach-hang?tukhoa=Nguyen" | jq
```

#### Thêm mới khách hàng

```sh
curl -sX POST "http://localhost:5000/api/dat-san/khach-hang" \
  -H "Content-Type: application/json" \
  -d '{"ho_ten":"Nguyen Van B","sdt":"0987654321","email":"b@example.com"}' | jq
```

#### Lưu phiếu đặt sân

```sh
curl -sX POST "http://localhost:5000/api/dat-san/phieu-dat-san" \
  -H "Content-Type: application/json" \
  -d '{"khach_hang_id":1,"tong_tien_du_kien":500000,"tien_dat_coc":100000}' | jq
```

#### Lưu chi tiết đặt sân

```sh
curl -sX POST "http://localhost:5000/api/dat-san/chi-tiet-dat-san" \
  -H "Content-Type: application/json" \
  -d '{"phieu_dat_san_id":1,"san_bong_id":2,"khung_gio":"18:00-20:00","ngay_bat_dau":"2025-06-01","ngay_ket_thuc":"2025-06-01","gia_thue_mot_buoi":250000}' | jq
```

#### Tính tổng số buổi và tổng tiền dự kiến cho 1 chi tiết đặt sân

```sh
curl -s "http://localhost:5000/api/dat-san/chi-tiet-dat-san/1/tinh-tien" | jq
```

#### Lấy thông tin phiếu đặt sân (chi tiết)

```sh
curl -s "http://localhost:5000/api/dat-san/phieu-dat-san/1" | jq
```