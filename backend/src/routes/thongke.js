const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/thong-ke?type=thang&year=2025
router.get('/', (req, res) => {
    const { type, year } = req.query;
    if (!['thang', 'quy', 'nam'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    let groupBy;
    if (type === 'thang') groupBy = "strftime('%Y-%m', ngay_thanh_toan)";
    else if (type === 'quy') groupBy = "strftime('%Y', ngay_thanh_toan) || '-Q' || ((cast(strftime('%m', ngay_thanh_toan) as integer)-1)/3 +1)";
    else groupBy = "strftime('%Y', ngay_thanh_toan)";

    const query = `
        SELECT ${groupBy} AS ky_thong_ke,
               SUM(tong_tien) AS tong_doanh_thu
        FROM hoa_don
        WHERE strftime('%Y', ngay_thanh_toan) = ?
        GROUP BY ky_thong_ke
        ORDER BY ky_thong_ke DESC;
    `;

    db.all(query, [year], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
