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

### IV. Test API

#### 1. Thống kê doanh thu

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

#### 2. Quản lí sân bóng

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
