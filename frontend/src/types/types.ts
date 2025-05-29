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
}
