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