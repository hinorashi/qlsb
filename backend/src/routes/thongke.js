const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/thong-ke?chuki=thang&nam=2025
router.get('/', (req, res) => {
    const { chuki, nam } = req.query;
    // Kiểm tra tham số chu kì hợp lệ
    if (!['thang', 'quy', 'nam'].includes(chuki)) {
        return res.status(400).json({ error: 'Chu kì ko hợp lệ' });
    }

    let groupBy;
    // Xác định kiểu group theo tháng, quý, năm
    if (chuki === 'thang') groupBy = "strftime('%Y-%m', ngay_thanh_toan)";
    else if (chuki === 'quy') groupBy = "strftime('%Y', ngay_thanh_toan) || '-Q' || ((cast(strftime('%m', ngay_thanh_toan) as integer)-1)/3 +1)";
    else groupBy = "strftime('%Y', ngay_thanh_toan)";

    // Nếu không truyền năm thì lấy tất cả các năm
    let query = `
        SELECT ${groupBy} AS ky_thong_ke,
               SUM(tong_tien) AS tong_doanh_thu
        FROM hoa_don
    `;
    let params = [];
    if (nam) {
        query += `WHERE strftime('%Y', ngay_thanh_toan) = ?\n`;
        params.push(nam);
    }
    query += `GROUP BY ky_thong_ke\nORDER BY ky_thong_ke DESC;`;

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET /api/thong-ke/chi-tiet?chuki=thang&thoigian=2025-04
router.get('/chi-tiet', (req, res) => {
    const { chuki, thoigian } = req.query;
    // Kiểm tra tham số truyền vào
    if (!chuki) return res.status(400).json({ error: 'Thiếu tham số chuki' });
    if (!thoigian) return res.status(400).json({ error: 'Thiếu tham số thoigian' });

    let dateFilter;
    switch (chuki) {
        case 'thang':
            // Lọc theo tháng
            dateFilter = `strftime('%Y-%m', hd.ngay_thanh_toan) = ?`;
            break;
        case 'quy':
            // Lọc theo quý, thoigian dạng 2025-Q2
            const [nam, quyRaw] = thoigian.split('-Q');
            const quy = parseInt(quyRaw);
            const months = [(quy - 1) * 3 + 1, (quy - 1) * 3 + 2, (quy - 1) * 3 + 3]
                .map(m => `'${m.toString().padStart(2, '0')}'`).join(',');
            dateFilter = `strftime('%Y', hd.ngay_thanh_toan) = '${nam}' AND strftime('%m', hd.ngay_thanh_toan) IN (${months})`;
            break;
        case 'nam':
            // Lọc theo năm
            dateFilter = `strftime('%Y', hd.ngay_thanh_toan) = ?`;
            break;
        default:
            return res.status(400).json({ 
                error: 'Loại thống kê không hợp lệ',
                chuki,
                thoigian
            });
    }

    // Truy vấn chi tiết hóa đơn theo kỳ thống kê
    const query = `
        SELECT
            hd.id AS hoa_don_id,
            kh.ho_ten AS ten_khach,
            sb.ten_san AS ten_san,
            hd.ngay_thanh_toan,
            hd.tong_tien
        FROM hoa_don hd
        JOIN phieu_dat_san pds ON hd.phieu_dat_san_id = pds.id
        JOIN khach_hang kh ON pds.khach_hang_id = kh.id
        JOIN chi_tiet_dat_san ctds ON ctds.phieu_dat_san_id = pds.id
        JOIN san_bong sb ON sb.id = ctds.san_bong_id
        WHERE ${dateFilter}
        GROUP BY hd.id
        ORDER BY hd.ngay_thanh_toan DESC
    `;

    const param = chuki === 'quy' ? [] : [thoigian];
    db.all(query, param, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
