export interface DoanhThu {
  ky_thong_ke: string;
  tong_doanh_thu: number;
}

export interface HoaDon {
  hoa_don_id: number;
  ten_khach: string;
  ten_san: string;
  ngay_thanh_toan: string;
  tong_tien: number;
}

export interface SanBong {
  id: number;
  ten_san: string;
  loai_san: string;
  mo_ta: string;
  gia_thue_theo_gio: number;
}

export interface KhachHang {
  id: number;
  ho_ten: string;
  sdt: string;
  email?: string;
}

export interface ChiTietDatSan {
  id: number;
  phieu_dat_san_id: number;
  san_bong_id: number;
  gio_bat_dau: string;
  gio_ket_thuc: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  gia_thue_theo_gio: number;
  gio_nhan_san?: string;
  gio_tra_san?: string;
}

// Types for checkout module
export interface CheckoutPhieuDatSan {
  id: number;
  ho_ten: string;
  sdt: string;
  ngay_dat: string;
}

export interface CheckoutHoaDon {
  id: number;
  ngay_thanh_toan: string;
  tong_tien: number;
  // Thông tin chi tiết đặt sân
  chi_tiet_dat_san_id?: number;
  gio_bat_dau?: string;
  gio_ket_thuc?: string;
  gio_nhan_san?: string;
  gio_tra_san?: string;
  gia_thue_theo_gio?: number;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  so_gio_vuot?: number;
  tien_phat?: number;
  tong_tien_san?: number;
}

export interface CheckoutMatHang {
  id: number;
  ten_mat_hang: string;
  don_vi: string;
  ngay_su_dung: string;
  so_luong: number;
  gia_ban: number;
  thanh_tien: number;
}

export interface MatHang {
  id: number;
  ten: string;
  don_vi: string;
  gia_ban: number;
}
