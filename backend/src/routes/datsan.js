const express = require('express');
const router = express.Router();
const db = require('../database');

// 1. Tìm sân trống theo khung giờ, loại sân, ngày bắt đầu/kết thúc
router.get('/san-trong', (req, res) => {
  const { loai_san, khung_gio, ngay_bat_dau, ngay_ket_thuc } = req.query;
  if (!loai_san || !khung_gio || !ngay_bat_dau || !ngay_ket_thuc) {
    return res.status(400).json({ error: 'Thiếu tham số' });
  }
  const sql = `
    SELECT s.*
    FROM san_bong s
    WHERE s.loai_san = ?
      AND s.id NOT IN (
        SELECT ctds.san_bong_id
        FROM chi_tiet_dat_san ctds
        WHERE ctds.khung_gio = ?
          AND (
            ctds.ngay_bat_dau <= ?
            AND ctds.ngay_ket_thuc >= ?
          )
      )
  `;
  db.all(sql, [loai_san, khung_gio, ngay_ket_thuc, ngay_bat_dau], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. Tính tổng số buổi và tổng tiền dự kiến cho 1 chi tiết đặt sân
router.get('/chi-tiet-dat-san/:id/tinh-tien', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      julianday(ngay_ket_thuc) - julianday(ngay_bat_dau) + 1 AS so_ngay,
      gia_thue_theo_gio,
      (julianday(ngay_ket_thuc) - julianday(ngay_bat_dau) + 1) * gia_thue_theo_gio AS tong_tien
    FROM chi_tiet_dat_san
    WHERE id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// 3. Lưu phiếu đặt sân
router.post('/phieu-dat-san', (req, res) => {
  const { khach_hang_id, tong_tien_du_kien, tien_dat_coc } = req.body;
  if (!khach_hang_id || tong_tien_du_kien == null || tien_dat_coc == null) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }
  db.run(
    'INSERT INTO phieu_dat_san (khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc) VALUES (?, DATE(\'now\'), ?, ?)',
    [khach_hang_id, tong_tien_du_kien, tien_dat_coc],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// 4. Lưu chi tiết đặt sân
router.post('/chi-tiet-dat-san', (req, res) => {
  let { phieu_dat_san_id, san_bong_id, khung_gio, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio } = req.body;
  if (!phieu_dat_san_id || !san_bong_id || !khung_gio || !ngay_bat_dau || !ngay_ket_thuc) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }
  // Nếu không có giá, lấy từ bảng san_bong
  if (gia_thue_theo_gio == null) {
    db.get('SELECT gia_thue_theo_gio FROM san_bong WHERE id = ?', [san_bong_id], (err, row) => {
      if (err || !row) return res.status(500).json({ error: 'Không lấy được giá sân' });
      gia_thue_theo_gio = row.gia_thue_theo_gio;
      insertChiTiet();
    });
  } else {
    insertChiTiet();
  }
  function insertChiTiet() {
    db.run(
      'INSERT INTO chi_tiet_dat_san (phieu_dat_san_id, san_bong_id, khung_gio, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio) VALUES (?, ?, ?, ?, ?, ?)',
      [phieu_dat_san_id, san_bong_id, khung_gio, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  }
});

// 5. Lấy thông tin phiếu đặt sân (chi tiết)
router.get('/phieu-dat-san/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      pds.*, kh.ho_ten, kh.sdt, kh.email,
      ctds.san_bong_id, sb.ten_san, sb.loai_san, sb.mo_ta,
      ctds.khung_gio, ctds.ngay_bat_dau, ctds.ngay_ket_thuc, ctds.gia_thue_theo_gio
    FROM phieu_dat_san pds
    JOIN khach_hang kh ON pds.khach_hang_id = kh.id
    JOIN chi_tiet_dat_san ctds ON ctds.phieu_dat_san_id = pds.id
    JOIN san_bong sb ON sb.id = ctds.san_bong_id
    WHERE pds.id = ?
  `;
  db.all(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
