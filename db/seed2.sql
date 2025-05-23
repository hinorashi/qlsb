-- RESET ID nếu cần
DELETE FROM sqlite_sequence;

-- KHÁCH HÀNG
INSERT INTO khach_hang (ho_ten, sdt, email)
VALUES 
('Nguyễn Văn A', '0909000111', 'a@abc.com'),
('Trần Thị B', '0909000222', 'b@abc.com');

-- SÂN
INSERT INTO san_bong (ten_san, loai_san, mo_ta)
VALUES 
('Sân A1', 'mini', 'Sân mini phía Tây'),
('Sân A2', 'mini', 'Sân mini phía Đông');

-- MẶT HÀNG
INSERT INTO mat_hang (ten, don_vi, gia_ban)
VALUES 
('Nước suối', 'chai', 10000),
('Nước ngọt', 'lon', 15000),
('Snack', 'gói', 12000);

-- PHIẾU ĐẶT SÂN & CHI TIẾT
INSERT INTO phieu_dat_san (khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc)
VALUES (1, '2025-01-02', 800000, 80000),
       (2, '2025-03-10', 1200000, 120000);

INSERT INTO chi_tiet_dat_san (phieu_dat_san_id, san_bong_id, khung_gio, ngay_bat_dau, ngay_ket_thuc, gia_thue_mot_buoi)
VALUES 
(1, 1, '18:00-20:00', '2025-01-05', '2025-01-20', 100000),
(2, 2, '19:00-21:00', '2025-03-15', '2025-04-15', 150000);

-- HÓA ĐƠN
INSERT INTO hoa_don (phieu_dat_san_id, ngay_thanh_toan, tong_tien, so_tien_thuc_tra, so_tien_con_lai)
VALUES
(1, '2025-01-25', 800000, 800000, 0),
(2, '2025-04-20', 1350000, 1300000, 50000);

-- MẶT HÀNG ĐÃ DÙNG
INSERT INTO chi_tiet_su_dung_mat_hang (hoa_don_id, ngay_su_dung, mat_hang_id, so_luong, gia_ban, thanh_tien)
VALUES
-- Hóa đơn 1 (Jan)
(1, '2025-01-10', 1, 5, 10000, 50000),
(1, '2025-01-15', 2, 3, 15000, 45000),

-- Hóa đơn 2 (Apr)
(2, '2025-03-20', 3, 4, 12000, 48000),
(2, '2025-04-01', 1, 6, 10000, 60000);
