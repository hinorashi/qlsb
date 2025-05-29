import axios from "axios";
import { DoanhThu, HoaDon, SanBong } from "@/types/types";

// Địa chỉ backend API thống kê doanh thu
const BASE_URL = "http://localhost:5000/api/thong-ke";
const SAN_BONG_URL = "http://localhost:5000/api/san-bong";

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

// API sân bóng
export async function fetchSanBong(keyword?: string): Promise<SanBong[]> {
  const res = await axios.get(
    SAN_BONG_URL + (keyword ? `?keyword=${encodeURIComponent(keyword)}` : "")
  );
  return res.data;
}

export async function getSanBongById(id: number): Promise<SanBong> {
  const res = await axios.get(`${SAN_BONG_URL}/${id}`);
  return res.data;
}

export async function createSanBong(
  data: Omit<SanBong, "id">
): Promise<{ id: number }> {
  const res = await axios.post(SAN_BONG_URL, data);
  return res.data;
}

export async function updateSanBong(
  id: number,
  data: Omit<SanBong, "id">
): Promise<{ changes: number }> {
  const res = await axios.put(`${SAN_BONG_URL}/${id}`, data);
  return res.data;
}

export async function deleteSanBong(id: number): Promise<{ changes: number }> {
  const res = await axios.delete(`${SAN_BONG_URL}/${id}`);
  return res.data;
}
