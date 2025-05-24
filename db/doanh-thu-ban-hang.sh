#!/bin/sh

sqlite3 qlsb.db <<EOF
.headers on
.mode column
SELECT
    mh.ten,
    SUM(c.so_luong) AS tong_so_luong,
    SUM(c.thanh_tien) AS tong_doanh_thu
FROM chi_tiet_su_dung_mat_hang c
JOIN mat_hang mh ON mh.id = c.mat_hang_id
GROUP BY mh.id
ORDER BY tong_doanh_thu DESC;
EOF