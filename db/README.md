# Hướng dẫn thao tác với DB

## I. SQLite

### 1. Cài đặt

Tải bộ SQLite tools tại:
👉 https://www.sqlite.org/download.html

Chọn file dưới đây để dùng cả CLI:
- sqlite-tools-win-x64-*.zip (https://www.sqlite.org/2025/sqlite-tools-win-x64-3490200.zip)

Giải nén, copy thư mục vào thư mục trên máy, ví dụ `C:\sqlite`

Thêm đường dẫn `C:\sqlite` vào PATH của hệ thống.

Nếu cần giao diện đồ họa GUI, tải thêm:
- SQLiteStudio (https://sqlitestudio.pl/)
- DB Browser for SQLite (https://sqlitebrowser.org/dl/)
- SQLite Expert (https://www.sqliteexpert.com/)

Ví dụ ta dùng **DB Browser for SQLite**: https://github.com/sqlitebrowser/sqlitebrowser/releases/download/v3.13.1/DB.Browser.for.SQLite-v3.13.1-win64.msi

### 2. Tạo DB và bảng

Sử dụng file `schema.sql` để tạo bảng trong DB:
```sh
sqlite3 qlsb.db < schema.sql
```

### 3. Chèn dữ liệu mẫu

Sử dụng file `seed.sql` để chèn dữ liệu mẫu vào DB:
```sh
sqlite3 qlsb.db < seed.sql
```

### 4. Xem dữ liệu

Kết nối vào DB:
```sh
sqlite3 qlsb.db
```

```sqlite
sqlite> .tables # show all tables
sqlite> SELECT * FROM khach_hang;
sqlite> .headers on
sqlite> .mode column
sqlite> SELECT * FROM hoa_don;
```

### 5. Xóa dữ liệu

```sh
sqlite3 qlsb.db < clean.sql
```