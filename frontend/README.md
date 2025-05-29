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

### 1. So sánh Recharts và Chart.js

So sánh hai thư viện mạnh mẽ: **Recharts** (chuyên React) và **Chart.js** (phổ thông):

| Tiêu chí                  | **Recharts**                | **Chart.js (qua react-chartjs-2)** |
| ------------------------- | --------------------------- | ---------------------------------- |
| Dành riêng cho React      | ✅ Rất hợp                  | ❌ Cần wrapper                    |
| Cú pháp JSX trực quan     | ✅ Rất tốt                  | 😐 Khó hơn                        |
| Tùy biến kiểu biểu đồ     | Dễ                          | Nhiều, phức tạp                    |
| Tài liệu chính chủ        | ✅ Có                       | ✅ Có                             |
| Khả năng mở rộng nâng cao | ⚠️ Hạn chế khi nhiều trục   | ✅ Mạnh mẽ hơn                    |

**Kết luận:** Chọn **Recharts** vì dễ tích hợp, dễ tùy biến, cú pháp JSX giống các component khác.


### 2. Cài đặt

```sh
npm install recharts
```

Các biểu đồ có thể triển khai:

| Loại biểu đồ | Mô tả                               |
| ------------ | ----------------------------------- |
| 📊 BarChart  | Tổng doanh thu theo tháng, quý, năm |
| 📈 LineChart | Biến động doanh thu theo thời gian  |
| 🍩 PieChart  | Tỉ lệ doanh thu từ các mặt hàng     |
| 🧱 AreaChart | So sánh thuê sân vs. đồ ăn          |

## IV. Tích hợp API

## V. Chạy ứng dụng

```sh
npm run dev
```
## VI. Truy cập ứng dụng

Mở trình duyệt và truy cập vào địa chỉ: [http://localhost:3000](http://localhost:3000)

