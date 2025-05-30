const express = require('express');
const router = express.Router();
const db = require('../database');

// Lấy danh sách khách hàng hoặc tìm kiếm theo tên
router.get('/', (req, res) => {
  const { tukhoa } = req.query;
  let sql = 'SELECT * FROM khach_hang';
  let params = [];
  if (tukhoa) {
    sql += ' WHERE ho_ten LIKE ?';
    params.push(`%${tukhoa}%`);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Thêm mới khách hàng
router.post('/', (req, res) => {
  const { ho_ten, sdt, email } = req.body;
  if (!ho_ten || !sdt) return res.status(400).json({ error: 'Thiếu thông tin' });
  db.run(
    'INSERT INTO khach_hang (ho_ten, sdt, email) VALUES (?, ?, ?)',
    [ho_ten, sdt, email],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
