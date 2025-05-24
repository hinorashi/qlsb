/*
Cover các trường hợp:
- Doanh thu âm/lệch để test nợ/phát sinh
- Thống kê theo sân hoặc theo khách hàng
- Doanh thu thuê sân bình thường
- Phát sinh mặt hàng ăn uống lớn
- Hóa đơn thanh toán thiếu (nợ)
- Hóa đơn trả dư (tiền thừa)
*/

-- RESET ID nếu cần
DELETE FROM sqlite_sequence;

-- KHÁCH HÀNG
INSERT INTO khach_hang (ho_ten, sdt, email)
VALUES 
('Nguyễn Văn A', '0909000111', 'a@abc.com'),
('Trần Thị B', '0909000222', 'b@abc.com');
INSERT INTO khach_hang (ho_ten, sdt, email)
VALUES 
('Lê Văn C', '0909333444', 'c@abc.com'),
('Phạm Thị D', '0909444555', 'd@abc.com');

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
INSERT INTO phieu_dat_san (khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc)
VALUES 
(3, '2025-05-01', 1000000, 100000),
(4, '2025-06-10', 600000, 60000);

INSERT INTO chi_tiet_dat_san (phieu_dat_san_id, san_bong_id, khung_gio, ngay_bat_dau, ngay_ket_thuc, gia_thue_mot_buoi)
VALUES 
(1, 1, '18:00-20:00', '2025-01-05', '2025-01-20', 100000),
(2, 2, '19:00-21:00', '2025-03-15', '2025-04-15', 150000);
INSERT INTO chi_tiet_dat_san (phieu_dat_san_id, san_bong_id, khung_gio, ngay_bat_dau, ngay_ket_thuc, gia_thue_mot_buoi)
VALUES
(3, 1, '17:00-19:00', '2025-05-03', '2025-05-20', 100000),
(4, 2, '18:00-20:00', '2025-06-15', '2025-06-30', 100000);

-- HÓA ĐƠN
INSERT INTO hoa_don (phieu_dat_san_id, ngay_thanh_toan, tong_tien, so_tien_thuc_tra, so_tien_con_lai)
VALUES
(1, '2025-01-25', 800000, 800000, 0),
(2, '2025-04-20', 1350000, 1300000, 50000);

-- HÓA ĐƠN (một nợ, một dư)
INSERT INTO hoa_don (phieu_dat_san_id, ngay_thanh_toan, tong_tien, so_tien_thuc_tra, so_tien_con_lai)
VALUES
-- khách C còn nợ
(3, '2025-05-25', 1000000, 950000, 50000),
-- khách D trả dư
(4, '2025-06-30', 600000, 610000, -10000);

-- MẶT HÀNG ĐÃ DÙNG
INSERT INTO chi_tiet_su_dung_mat_hang (hoa_don_id, ngay_su_dung, mat_hang_id, so_luong, gia_ban, thanh_tien)
VALUES
-- Hóa đơn 1 (Jan)
(1, '2025-01-10', 1, 5, 10000, 50000),
(1, '2025-01-15', 2, 3, 15000, 45000),

-- Hóa đơn 2 (Apr)
(2, '2025-03-20', 3, 4, 12000, 48000),
(2, '2025-04-01', 1, 6, 10000, 60000),

-- Hóa đơn 3 (May)
(3, '2025-05-10', 1, 10, 10000, 100000),
(3, '2025-05-17', 2, 8, 15000, 120000),

-- Hóa đơn 4 (June)
(4, '2025-06-16', 2, 5, 15000, 75000),
(4, '2025-06-20', 3, 10, 12000, 120000);