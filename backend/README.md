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
├── db/
│   └── database.js       # Kết nối SQLite
├── routes/
│   └── thongke.js        # API thống kê
├── server.js             # Main entry point
```

## III. Chạy server

```sh
node server.js
```

### IV. Test API

```sh
GET http://localhost:3000/api/thong-ke?type=thang&year=2025
```
