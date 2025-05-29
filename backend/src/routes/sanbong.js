const express = require('express');
const router = express.Router();
const db = require('../database');

// 🔍 Tìm kiếm sân bóng theo tên
router.get('/', (req, res) => {
  const { tukhoa } = req.query;
  let sql = 'SELECT * FROM san_bong';
  let params = [];
  if (tukhoa) {
    sql += ' WHERE ten_san LIKE ?';
    params.push(`%${tukhoa}%`);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🧾 Xem chi tiết sân bóng theo ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM san_bong WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Không tìm thấy sân bóng' });
    res.json(row);
  });
});

// ➕ Thêm mới sân bóng
router.post('/', (req, res) => {
  const { ten_san, loai_san, mo_ta } = req.body;
  if (!ten_san || !loai_san) return res.status(400).json({ error: 'Thiếu thông tin' });
  db.run(
    'INSERT INTO san_bong (ten_san, loai_san, mo_ta) VALUES (?, ?, ?)',
    [ten_san, loai_san, mo_ta],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// ✏️ Cập nhật thông tin sân bóng
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { ten_san, loai_san, mo_ta } = req.body;
  db.run(
    'UPDATE san_bong SET ten_san = ?, loai_san = ?, mo_ta = ? WHERE id = ?',
    [ten_san, loai_san, mo_ta, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// ❌ Xóa sân bóng
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM san_bong WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

module.exports = router;
