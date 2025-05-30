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
  gia_thue_mot_buoi: number;
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
  khung_gio: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  gia_thue_mot_buoi: number;
}
