PRAGMA foreign_keys = OFF;

DELETE FROM chi_tiet_su_dung_mat_hang;
DELETE FROM chi_tiet_dat_san;
DELETE FROM chi_tiet_phieu_nhap;
DELETE FROM hoa_don;
DELETE FROM phieu_dat_san;
DELETE FROM phieu_nhap_hang;

DELETE FROM khach_hang;
DELETE FROM san_bong;
DELETE FROM mat_hang;
DELETE FROM nha_cung_cap;

-- reset ID tự tăng (AUTOINCREMENT)
DELETE FROM sqlite_sequence WHERE name IN (
  'khach_hang', 'san_bong', 'phieu_dat_san', 'chi_tiet_dat_san',
  'hoa_don', 'mat_hang', 'chi_tiet_su_dung_mat_hang',
  'nha_cung_cap', 'phieu_nhap_hang', 'chi_tiet_phieu_nhap'
);

PRAGMA foreign_keys = ON;
