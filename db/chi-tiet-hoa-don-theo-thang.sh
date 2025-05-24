#!/bin/sh

# This script calculates the monthly revenue for a given year and month.
# Usage: ./chi-tiet-hoa-don-theo-thang.sh <year-month>
if [ "$#" -ne 1 ]; then
    echo "Sử dụng: ./chi-tiet-hoa-don-theo-thang.sh <year-month>"
    echo "Ví dụ: ./chi-tiet-hoa-don-theo-thang.sh 2025-04"
    exit 1
fi
THANG=$1

sqlite3 qlsb.db <<EOF
.headers on
.mode column
SELECT
    hd.id AS hoa_don_id,
    kh.ho_ten AS ten_khach,
    sb.ten_san,
    hd.ngay_thanh_toan,
    hd.tong_tien
FROM hoa_don hd
JOIN phieu_dat_san pds ON pds.id = hd.phieu_dat_san_id
JOIN khach_hang kh ON kh.id = pds.khach_hang_id
JOIN chi_tiet_dat_san ctds ON ctds.phieu_dat_san_id = pds.id
JOIN san_bong sb ON sb.id = ctds.san_bong_id
WHERE strftime('%Y-%m', hd.ngay_thanh_toan) = '$THANG';
EOF