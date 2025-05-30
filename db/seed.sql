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
('Trần Thị B', '0909000222', 'b@abc.com'),
('Lê Văn C', '0909333444', 'c@abc.com'),
('Phạm Thị D', '0909444555', 'd@abc.com'),
('Đỗ Văn E', '0909555666', 'e@abc.com'),
('Ngô Thị F', '0909666777', 'f@abc.com');

-- SÂN
INSERT INTO san_bong (ten_san, loai_san, mo_ta, gia_thue_theo_gio)
VALUES 
('Sân A1', '7', 'Sân 7 phía Tây', 120000),
('Sân A2', '7', 'Sân 7 phía Đông', 110000),
('Sân B1', '11', 'Sân 11 phía Nam', 200000);

-- MẶT HÀNG
INSERT INTO mat_hang (ten, don_vi, gia_ban)
VALUES 
('Nước suối', 'chai', 10000),
('Nước ngọt', 'lon', 15000),
('Snack', 'gói', 12000);

-- NHÀ CUNG CẤP
INSERT INTO nha_cung_cap (ten, dia_chi, email, dien_thoai, mo_ta)
VALUES ('Công ty Đồ Uống ABC', '123 Đường Lê Lợi', 'abc@drink.vn', '0909123456', 'Chuyên cung cấp nước');

-- PHIẾU NHẬP HÀNG
INSERT INTO phieu_nhap_hang (nha_cung_cap_id, ngay_nhap)
VALUES (1, '2025-04-01');

-- CHI TIẾT PHIẾU NHẬP
INSERT INTO chi_tiet_phieu_nhap (phieu_nhap_hang_id, mat_hang_id, so_luong, don_gia, thanh_tien)
VALUES (1, 1, 100, 8000, 800000),
       (1, 2, 50, 12000, 600000);

-- PHIẾU ĐẶT SÂN & CHI TIẾT
INSERT INTO phieu_dat_san (khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc)
VALUES
(1, '2025-01-02', 800000, 80000),
(2, '2025-03-10', 1200000, 120000),
(3, '2025-05-01', 1000000, 100000),
(4, '2025-06-10', 600000, 60000),
(5, '2023-03-01', 500000, 50000),
(6, '2024-07-10', 700000, 70000);

INSERT INTO chi_tiet_dat_san (phieu_dat_san_id, san_bong_id, khung_gio, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio)
VALUES 
(1, 1, '18:00-20:00', '2025-01-05', '2025-01-20', 100000),
(2, 2, '19:00-21:00', '2025-03-15', '2025-04-15', 150000),
(3, 1, '17:00-19:00', '2025-05-03', '2025-05-20', 100000),
(4, 2, '18:00-20:00', '2025-06-15', '2025-06-30', 100000),
(3, 1, '17:00-19:00', '2023-03-05', '2023-03-15', 50000),
(4, 2, '18:00-20:00', '2024-07-12', '2024-07-20', 70000);

-- HÓA ĐƠN
INSERT INTO hoa_don (phieu_dat_san_id, ngay_thanh_toan, tong_tien, so_tien_thuc_tra, so_tien_con_lai)
VALUES
(1, '2025-01-25', 800000, 800000, 0),
(2, '2025-04-20', 1350000, 1300000, 50000),
(3, '2023-03-18', 500000, 500000, 0),
(4, '2024-07-25', 700000, 700000, 0);

-- HÓA ĐƠN (một nợ, một dư)
INSERT INTO hoa_don (phieu_dat_san_id, ngay_thanh_toan, tong_tien, so_tien_thuc_tra, so_tien_con_lai)
VALUES
-- khách C còn nợ
(5, '2025-05-25', 1000000, 950000, 50000),
-- khách D trả dư
(6, '2025-06-30', 600000, 610000, -10000);

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
(4, '2025-06-20', 3, 10, 12000, 120000),

-- 2023
(3, '2023-03-10', 1, 3, 10000, 30000),
-- 2024
(4, '2024-07-15', 2, 5, 15000, 75000);

-- DỮ LIỆU TEST BỔ SUNG CÁC THÁNG 2023-2025
-- Thêm phiếu đặt sân, chi tiết, hóa đơn và mặt hàng cho các tháng khác nhau

-- PHIẾU ĐẶT SÂN & CHI TIẾT (bổ sung)
INSERT INTO phieu_dat_san (khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc) VALUES
(2, '2023-02-10', 400000, 40000),
(3, '2023-08-15', 600000, 60000),
(4, '2024-01-20', 900000, 90000),
(5, '2024-09-05', 800000, 80000),
(6, '2025-02-12', 1100000, 110000),
(1, '2025-11-18', 1200000, 120000);

INSERT INTO chi_tiet_dat_san (phieu_dat_san_id, san_bong_id, khung_gio, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio) VALUES
(7, 1, '18:00-20:00', '2023-02-12', '2023-02-20', 40000),
(8, 2, '19:00-21:00', '2023-08-16', '2023-08-25', 60000),
(9, 1, '17:00-19:00', '2024-01-22', '2024-01-30', 90000),
(10, 2, '18:00-20:00', '2024-09-07', '2024-09-15', 80000),
(11, 1, '17:00-19:00', '2025-02-14', '2025-02-28', 110000),
(12, 2, '18:00-20:00', '2025-11-20', '2025-11-30', 120000);

-- HÓA ĐƠN (bổ sung)
INSERT INTO hoa_don (phieu_dat_san_id, ngay_thanh_toan, tong_tien, so_tien_thuc_tra, so_tien_con_lai) VALUES
(7, '2023-02-21', 400000, 400000, 0),
(8, '2023-08-26', 600000, 600000, 0),
(9, '2024-01-31', 900000, 900000, 0),
(10, '2024-09-16', 800000, 750000, 50000), -- còn nợ
(11, '2025-02-28', 1100000, 1110000, -10000), -- trả dư
(12, '2025-12-01', 1200000, 1200000, 0);

-- MẶT HÀNG ĐÃ DÙNG (bổ sung)
INSERT INTO chi_tiet_su_dung_mat_hang (hoa_don_id, ngay_su_dung, mat_hang_id, so_luong, gia_ban, thanh_tien) VALUES
(7, '2023-02-15', 1, 2, 10000, 20000),
(7, '2023-02-18', 2, 1, 15000, 15000),
(8, '2023-08-20', 3, 5, 12000, 60000),
(9, '2024-01-25', 1, 8, 10000, 80000),
(10, '2024-09-10', 2, 10, 15000, 150000),
(11, '2025-02-20', 3, 12, 12000, 144000),
(12, '2025-11-25', 1, 6, 10000, 60000);
