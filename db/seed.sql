INSERT INTO khach_hang (ho_ten, sdt, email)
VALUES ('Nguyễn Văn A', '0912345678', 'a@gmail.com');

INSERT INTO san_bong (ten_san, loai_san, mo_ta)
VALUES ('Sân 1A', 'mini', 'Sân mini phía Đông');

INSERT INTO mat_hang (ten, don_vi, gia_ban)
VALUES ('Nước suối', 'chai', 10000),
       ('Snack', 'gói', 15000);

INSERT INTO nha_cung_cap (ten, dia_chi, email, dien_thoai, mo_ta)
VALUES ('Công ty Đồ Uống ABC', '123 Đường Lê Lợi', 'abc@drink.vn', '0909123456', 'Chuyên cung cấp nước');

INSERT INTO phieu_nhap_hang (nha_cung_cap_id, ngay_nhap)
VALUES (1, '2025-04-01');

INSERT INTO chi_tiet_phieu_nhap (phieu_nhap_hang_id, mat_hang_id, so_luong, don_gia, thanh_tien)
VALUES (1, 1, 100, 8000, 800000),
       (1, 2, 50, 12000, 600000);
