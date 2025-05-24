# Frontend với Next.js

## I. Cài đặt

```sh
npx create-next-app@latest frontend --js --tailwind --eslint --app --import-alias "@/*" --src-dir --no-experimental-app --turbopack --yes
cd frontend
# axios để gọi API, classnames để gộp CSS, date-fns để xử lý ngày tháng.
npm install axios classnames date-fns
```

## II. Cấu trúc thư mục

```plaintext
frontend/
├── public/                     # Thư mục chứa tài nguyên tĩnh
├── src/
│   ├── app/                    # Các trang của ứng dụng
│   │   └── page.tsx            # Giao diện chính
│   ├── components/             # Các component tái sử dụng
│   │   ├── RevenueTable.tsx    # Bảng doanh thu
│   │   ├── InvoiceDetails.tsx  # Chi tiết hóa đơn
│   │   └── FilterBar.tsx       # Lọc theo tháng/quý/năm
│   ├── lib/
│   │   └── api.ts              # Gọi API
│   ├── types/
│   │   └── types.ts            # Định nghĩa kiểu dữ liệu
├── tailwind.config.js          # Cấu hình Tailwind
```

## III. Tạo trang thống kê

_todo_

## IV. Tích hợp API

## V. Chạy ứng dụng

```sh
npm run dev
```
## VI. Truy cập ứng dụng

Mở trình duyệt và truy cập vào địa chỉ: [http://localhost:3000](http://localhost:3000)

