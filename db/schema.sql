-- Bật ràng buộc foreign key
PRAGMA foreign_keys = ON;

CREATE TABLE khach_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ho_ten TEXT NOT NULL,
    sdt TEXT,
    email TEXT
);

CREATE TABLE san_bong (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_san TEXT NOT NULL,
    loai_san TEXT CHECK(loai_san IN ('7','11')),
    mo_ta TEXT,
    gia_thue_theo_gio REAL
);

CREATE TABLE phieu_dat_san (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    khach_hang_id INTEGER NOT NULL,
    ngay_dat DATE NOT NULL,
    tong_tien_du_kien REAL,
    tien_dat_coc REAL,
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id)
);

CREATE TABLE chi_tiet_dat_san (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phieu_dat_san_id INTEGER NOT NULL,
    san_bong_id INTEGER NOT NULL,
    gio_bat_dau TEXT NOT NULL, -- giờ bắt đầu (HH:mm)
    gio_ket_thuc TEXT NOT NULL, -- giờ kết thúc (HH:mm)
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    gia_thue_theo_gio REAL,
    gio_nhan_san TEXT, -- giờ nhận sân thực tế (ISO string hoặc HH:mm)
    gio_tra_san TEXT,  -- giờ trả sân thực tế (ISO string hoặc HH:mm)
    FOREIGN KEY (phieu_dat_san_id) REFERENCES phieu_dat_san(id),
    FOREIGN KEY (san_bong_id) REFERENCES san_bong(id)
);

CREATE TABLE hoa_don (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phieu_dat_san_id INTEGER NOT NULL,
    ngay_thanh_toan DATE NOT NULL,
    tong_tien REAL,
    so_tien_thuc_tra REAL,
    so_tien_con_lai REAL,
    FOREIGN KEY (phieu_dat_san_id) REFERENCES phieu_dat_san(id)
);

CREATE TABLE mat_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten TEXT NOT NULL,
    don_vi TEXT,
    gia_ban REAL
);

CREATE TABLE chi_tiet_su_dung_mat_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hoa_don_id INTEGER NOT NULL,
    ngay_su_dung DATE NOT NULL,
    mat_hang_id INTEGER NOT NULL,
    so_luong INTEGER,
    gia_ban REAL,
    thanh_tien REAL,
    FOREIGN KEY (hoa_don_id) REFERENCES hoa_don(id),
    FOREIGN KEY (mat_hang_id) REFERENCES mat_hang(id)
);

CREATE TABLE nha_cung_cap (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten TEXT NOT NULL,
    dia_chi TEXT,
    email TEXT,
    dien_thoai TEXT,
    mo_ta TEXT
);

CREATE TABLE phieu_nhap_hang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nha_cung_cap_id INTEGER NOT NULL,
    ngay_nhap DATE NOT NULL,
    FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap(id)
);

CREATE TABLE chi_tiet_phieu_nhap (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phieu_nhap_hang_id INTEGER NOT NULL,
    mat_hang_id INTEGER NOT NULL,
    so_luong INTEGER,
    don_gia REAL,
    thanh_tien REAL,
    FOREIGN KEY (phieu_nhap_hang_id) REFERENCES phieu_nhap_hang(id),
    FOREIGN KEY (mat_hang_id) REFERENCES mat_hang(id)
);
