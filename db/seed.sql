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
INSERT INTO khach_hang (id, ho_ten, sdt, email)
VALUES 
(1, 'Nguyễn Văn A', '0909000111', 'a@abc.com'),
(2, 'Trần Thị B', '0909000222', 'b@abc.com'),
(3, 'Lê Văn C', '0909333444', 'c@abc.com'),
(4, 'Phạm Thị D', '0909444555', 'd@abc.com'),
(5, 'Đỗ Văn E', '0909555666', 'e@abc.com'),
(6, 'Ngô Thị F', '0909666777', 'f@abc.com');

-- SÂN
INSERT INTO san_bong (id, ten_san, loai_san, mo_ta, gia_thue_theo_gio)
VALUES 
(1, 'Sân A1', '7', 'Sân 7 phía Tây', 120000),
(2, 'Sân A2', '7', 'Sân 7 phía Đông', 110000),
(3, 'Sân B1', '11', 'Sân 11 phía Nam', 200000);

-- MẶT HÀNG
INSERT INTO mat_hang (id, ten, don_vi, gia_ban)
VALUES 
(1, 'Nước suối', 'chai', 10000),
(2, 'Nước ngọt', 'lon', 15000),
(3, 'Snack', 'gói', 12000);

-- NHÀ CUNG CẤP
INSERT INTO nha_cung_cap (id, ten, dia_chi, email, dien_thoai, mo_ta)
VALUES (1, 'Công ty Đồ Uống ABC', '123 Đường Lê Lợi', 'abc@drink.vn', '0909123456', 'Chuyên cung cấp nước');

-- PHIẾU NHẬP HÀNG
INSERT INTO phieu_nhap_hang (id, nha_cung_cap_id, ngay_nhap)
VALUES (1, 1, '2025-04-01');

-- CHI TIẾT PHIẾU NHẬP
INSERT INTO chi_tiet_phieu_nhap (id, phieu_nhap_hang_id, mat_hang_id, so_luong, don_gia, thanh_tien)
VALUES (1, 1, 1, 100, 8000, 800000),
       (2, 1, 2, 50, 12000, 600000);

-- PHIẾU ĐẶT SÂN & CHI TIẾT
INSERT INTO phieu_dat_san (id, khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc)
VALUES
(1, 1, '2025-01-02', 800000, 80000),
(2, 2, '2025-03-10', 1200000, 120000),
(3, 3, '2025-05-01', 1000000, 100000),
(4, 4, '2025-06-10', 600000, 60000),
(5, 5, '2023-03-01', 500000, 50000),
(6, 6, '2024-07-10', 700000, 70000),
(7, 2, '2023-02-10', 400000, 40000),
(8, 3, '2023-08-15', 600000, 60000),
(9, 4, '2024-01-20', 900000, 90000);

INSERT INTO chi_tiet_dat_san (id, phieu_dat_san_id, san_bong_id, gio_bat_dau, gio_ket_thuc, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio, gio_nhan_san, gio_tra_san)
VALUES 
(1, 1, 1, '18:00', '20:00', '2025-01-05', '2025-01-20', 100000, NULL, NULL),
(2, 2, 2, '19:00', '21:00', '2025-03-15', '2025-04-15', 150000, NULL, NULL),
(3, 3, 1, '17:00', '19:00', '2025-05-03', '2025-05-20', 100000, NULL, NULL),
(4, 4, 2, '18:00', '20:00', '2025-06-15', '2025-06-30', 100000, NULL, NULL),
(5, 3, 1, '17:00', '19:00', '2023-03-05', '2023-03-15', 50000, NULL, NULL),
(6, 4, 2, '18:00', '20:00', '2024-07-12', '2024-07-20', 70000, NULL, NULL),
(7, 7, 1, '18:00', '20:00', '2023-02-12', '2023-02-12', 350000, NULL, NULL),
(8, 8, 2, '19:00', '21:00', '2023-08-16', '2023-08-16', 400000, NULL, NULL),
(9, 9, 1, '17:00', '19:00', '2024-01-22', '2024-01-22', 500000, NULL, NULL);

-- HÓA ĐƠN
INSERT INTO hoa_don (id, phieu_dat_san_id, ngay_thanh_toan, tong_tien, tien_thue_san, so_tien_thuc_tra, so_tien_con_lai)
VALUES
(1, 1, '2025-01-25', 800000, 700000, 800000, 0),
(2, 2, '2025-04-20', 1350000, 1200000, 1300000, 50000),
(3, 3, '2023-03-18', 500000, 470000, 500000, 0),
(4, 4, '2024-07-25', 700000, 600000, 700000, 0),
(5, 5, '2025-05-25', 1000000, 900000, 950000, 50000),
(6, 6, '2025-06-30', 600000, 550000, 610000, -10000),
(7, 7, '2023-02-21', 370000, 350000, 370000, 0),
(8, 8, '2023-08-26', 460000, 400000, 400000, 60000),
(9, 9, '2024-01-31', 530000, 500000, 540000, -10000);

-- MẶT HÀNG ĐÃ DÙNG
INSERT INTO chi_tiet_su_dung_mat_hang (id, hoa_don_id, ngay_su_dung, mat_hang_id, so_luong, gia_ban, thanh_tien)
VALUES
(1, 1, '2025-01-10', 1, 5, 10000, 50000),
(2, 1, '2025-01-15', 2, 3, 15000, 45000),
(3, 2, '2025-03-20', 3, 4, 12000, 48000),
(4, 2, '2025-04-01', 1, 6, 10000, 60000),
(5, 3, '2025-05-10', 1, 10, 10000, 100000),
(6, 3, '2025-05-17', 2, 8, 15000, 120000),
(7, 4, '2025-06-16', 2, 5, 15000, 75000),
(8, 4, '2025-06-20', 3, 10, 12000, 120000),
(9, 3, '2023-03-10', 1, 3, 10000, 30000),
(10, 4, '2024-07-15', 2, 5, 15000, 75000),
(11, 7, '2023-02-15', 1, 2, 10000, 20000),
(12, 8, '2023-08-20', 3, 5, 12000, 60000),
(13, 9, '2024-01-25', 1, 3, 10000, 30000);
