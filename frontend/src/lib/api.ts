import axios from "axios";
import { DoanhThu, HoaDon } from "@/types/types";

// Địa chỉ backend API thống kê
const BASE_URL = "http://localhost:5000/api/thong-ke";

// Hàm lấy dữ liệu doanh thu tổng hợp theo chu kỳ và năm
export async function fetchRevenue(
  chuki: string,
  nam: string
): Promise<DoanhThu[]> {
  const res = await axios.get(`${BASE_URL}?chuki=${chuki}&nam=${nam}`);
  return res.data;
}

// Hàm lấy chi tiết hóa đơn theo chu kỳ và giá trị thời gian (tháng/quý/năm)
export async function fetchInvoiceDetails(
  chuki: string,
  thoigian: string
): Promise<HoaDon[]> {
  const res = await axios.get(
    `${BASE_URL}/chi-tiet?chuki=${chuki}&thoigian=${thoigian}`
  );
  return res.data;
}
