#!/bin/sh

sqlite3 qlsb.db <<EOF
.headers on
.mode column
SELECT 
    strftime('%Y-%m', ngay_thanh_toan) AS thang,
    SUM(tong_tien) AS tong_doanh_thu
FROM hoa_don
GROUP BY thang
ORDER BY thang DESC;
EOF