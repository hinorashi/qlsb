import axios from "axios";
import { DoanhThu, HoaDon, SanBong } from "@/types/types";

const API_BASE_URL = "http://localhost:5000/api";

// Hàm lấy dữ liệu doanh thu tổng hợp theo chu kỳ và năm
export async function fetchRevenue(
  chuki: string,
  nam: string
): Promise<DoanhThu[]> {
  const res = await axios.get(`${API_BASE_URL}/thong-ke?chuki=${chuki}&nam=${nam}`);
  return res.data;
}

// Hàm lấy chi tiết hóa đơn theo chu kỳ và giá trị thời gian (tháng/quý/năm)
export async function fetchInvoiceDetails(
  chuki: string,
  thoigian: string
): Promise<HoaDon[]> {
  const res = await axios.get(
    `${API_BASE_URL}/thong-ke/chi-tiet?chuki=${chuki}&thoigian=${thoigian}`
  );
  return res.data;
}

// API sân bóng
export async function fetchSanBong(tukhoa?: string): Promise<SanBong[]> {
  const res = await axios.get(
    `${API_BASE_URL}/san-bong` + (tukhoa ? `?tukhoa=${encodeURIComponent(tukhoa)}` : "")
  );
  return res.data;
}

export async function getSanBongById(id: number): Promise<SanBong> {
  const res = await axios.get(`${API_BASE_URL}/san-bong/${id}`);
  return res.data;
}

export async function createSanBong(
  data: Omit<SanBong, "id">
): Promise<{ id: number }> {
  const res = await axios.post(`${API_BASE_URL}/san-bong`, data);
  return res.data;
}

export async function updateSanBong(
  id: number,
  data: Omit<SanBong, "id">
): Promise<{ changes: number }> {
  const res = await axios.put(`${API_BASE_URL}/san-bong/${id}`, data);
  return res.data;
}

export async function deleteSanBong(id: number): Promise<{ changes: number }> {
  const res = await axios.delete(`${API_BASE_URL}/san-bong/${id}`);
  return res.data;
}

export async function fetchSanTrong(params: {
  loai_san: string;
  khung_gio: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
}) {
  const res = await axios.get(`${API_BASE_URL}/dat-san/san-trong`, { params });
  return res.data;
}

// Khách hàng
export async function fetchKhachHang(tukhoa?: string) {
  const res = await axios.get(
    `${API_BASE_URL}/khach-hang` + (tukhoa ? `?tukhoa=${encodeURIComponent(tukhoa)}` : "")
  );
  return res.data;
}

export async function createKhachHang(data: { ho_ten: string; sdt: string; email?: string }) {
  const res = await axios.post(`${API_BASE_URL}/khach-hang`, data);
  return res.data;
}

export async function createPhieuDatSan(data: {
  khach_hang_id: number;
  tong_tien_du_kien: number;
  tien_dat_coc: number;
}) {
  const res = await axios.post(`${API_BASE_URL}/dat-san/phieu-dat-san`, data);
  return res.data;
}

export async function createChiTietDatSan(data: {
  phieu_dat_san_id: number;
  san_bong_id: number;
  khung_gio: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  gia_thue_mot_buoi: number;
}) {
  const res = await axios.post(`${API_BASE_URL}/dat-san/chi-tiet-dat-san`, data);
  return res.data;
}

export async function tinhTienChiTietDatSan(id: number) {
  const res = await axios.get(
    `${API_BASE_URL}/dat-san/chi-tiet-dat-san/${id}/tinh-tien`
  );
  return res.data;
}

export async function fetchPhieuDatSanDetail(id: number) {
  const res = await axios.get(`${API_BASE_URL}/dat-san/phieu-dat-san/${id}`);
  return res.data;
}
