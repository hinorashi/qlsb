const express = require('express');
const router = express.Router();
const db = require('../database');

// 1. Tìm sân trống theo loại sân, giờ bắt đầu/kết thúc, ngày bắt đầu/kết thúc
router.get('/san-trong', (req, res) => {
  const { loai_san, gio_bat_dau, gio_ket_thuc, ngay_bat_dau, ngay_ket_thuc } = req.query;
  if (!loai_san || !gio_bat_dau || !gio_ket_thuc || !ngay_bat_dau || !ngay_ket_thuc) {
    return res.status(400).json({ error: 'Thiếu tham số' });
  }
  const sql = `
    SELECT s.*
    FROM san_bong s
    WHERE s.loai_san = ?
      AND s.id NOT IN (
        SELECT ctds.san_bong_id
        FROM chi_tiet_dat_san ctds
        WHERE ctds.gio_bat_dau = ? AND ctds.gio_ket_thuc = ?
          AND (
            ctds.ngay_bat_dau <= ?
            AND ctds.ngay_ket_thuc >= ?
          )
      )
  `;
  db.all(sql, [loai_san, gio_bat_dau, gio_ket_thuc, ngay_ket_thuc, ngay_bat_dau], (err, rows) => {
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
      gio_bat_dau, gio_ket_thuc, gia_thue_theo_gio
    FROM chi_tiet_dat_san
    WHERE id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    // Tính số giờ thuê mỗi ngày
    let so_gio = 0;
    if (row.gio_bat_dau && row.gio_ket_thuc) {
      const [h1, m1] = row.gio_bat_dau.split(":").map(Number);
      const [h2, m2] = row.gio_ket_thuc.split(":").map(Number);
      so_gio = (h2 + m2 / 60) - (h1 + m1 / 60);
    }
    const tong_tien = Math.round((row.so_ngay || 0) * so_gio * (row.gia_thue_theo_gio || 0));
    res.json({ ...row, so_gio, tong_tien });
  });
});

// 3. Lưu phiếu đặt sân
router.post('/phieu-dat-san', (req, res) => {
  const { khach_hang_id, tong_tien_du_kien, tien_dat_coc } = req.body;
  if (!khach_hang_id || tong_tien_du_kien == null || tien_dat_coc == null) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }
  db.run(
    "INSERT INTO phieu_dat_san (khach_hang_id, ngay_dat, tong_tien_du_kien, tien_dat_coc) VALUES (?, DATE('now'), ?, ?)",
    [khach_hang_id, tong_tien_du_kien, tien_dat_coc],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const phieuDatSanId = this.lastID;
      // Tạo hóa đơn ngay sau khi tạo phiếu đặt sân
      db.run(
        "INSERT INTO hoa_don (phieu_dat_san_id, ngay_thanh_toan, tong_tien, so_tien_thuc_tra, so_tien_con_lai) VALUES (?, DATE('now'), ?, 0, ?)",
        [phieuDatSanId, tong_tien_du_kien, tong_tien_du_kien],
        function (err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ id: phieuDatSanId });
        }
      );
    }
  );
});

// 4. Lưu chi tiết đặt sân
router.post('/chi-tiet-dat-san', (req, res) => {
  let { phieu_dat_san_id, san_bong_id, gio_bat_dau, gio_ket_thuc, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio } = req.body;
  if (!phieu_dat_san_id || !san_bong_id || !gio_bat_dau || !gio_ket_thuc || !ngay_bat_dau || !ngay_ket_thuc) {
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
      'INSERT INTO chi_tiet_dat_san (phieu_dat_san_id, san_bong_id, gio_bat_dau, gio_ket_thuc, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [phieu_dat_san_id, san_bong_id, gio_bat_dau, gio_ket_thuc, ngay_bat_dau, ngay_ket_thuc, gia_thue_theo_gio],
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
      ctds.gio_bat_dau, ctds.gio_ket_thuc, ctds.ngay_bat_dau, ctds.ngay_ket_thuc, ctds.gia_thue_theo_gio
    FROM phieu_dat_san pds
    JOIN khach_hang kh ON pds.khach_hang_id = kh.id
    LEFT JOIN chi_tiet_dat_san ctds ON ctds.phieu_dat_san_id = pds.id
    LEFT JOIN san_bong sb ON sb.id = ctds.san_bong_id
    WHERE pds.id = ?
  `;
  db.all(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Cập nhật giờ nhận/trả sân và tính lại tiền thuê nếu trả muộn
router.put('/chi-tiet-dat-san/:id', (req, res) => {
  const { id } = req.params;
  const { gio_nhan_san, gio_tra_san } = req.body;
  // Lấy thông tin chi tiết đặt sân
  db.get('SELECT * FROM chi_tiet_dat_san WHERE id = ?', [id], (err, ctds) => {
    if (err || !ctds) return res.status(404).json({ error: 'Không tìm thấy chi tiết đặt sân' });
    db.run('UPDATE chi_tiet_dat_san SET gio_nhan_san = ?, gio_tra_san = ? WHERE id = ?', [gio_nhan_san, gio_tra_san, id], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      // Tính số giờ vượt nếu có
      let so_gio_vuot = 0;
      let tien_phat = 0;
      if (gio_tra_san && ctds.gio_ket_thuc) {
        const [h1, m1] = ctds.gio_ket_thuc.split(":").map(Number);
        const [h2, m2] = gio_tra_san.split(":").map(Number);
        const gio_ket_thuc = h1 + m1 / 60;
        const gio_tra = h2 + m2 / 60;
        if (gio_tra > gio_ket_thuc) {
          so_gio_vuot = Math.ceil(gio_tra - gio_ket_thuc);
          tien_phat = so_gio_vuot * (ctds.gia_thue_theo_gio || 0);
        }
      }
      // Tính lại tổng tiền thuê sân thực tế (tổng tiền gốc + tiền phạt nếu có)
      let tong_tien_san = null;
      if (typeof ctds.gia_thue_theo_gio === 'number' && ctds.ngay_bat_dau && ctds.ngay_ket_thuc && ctds.gio_bat_dau && ctds.gio_ket_thuc) {
        const so_ngay = Math.floor((new Date(ctds.ngay_ket_thuc) - new Date(ctds.ngay_bat_dau)) / (1000*60*60*24)) + 1;
        const [h1, m1] = ctds.gio_bat_dau.split(":").map(Number);
        const [h2, m2] = ctds.gio_ket_thuc.split(":").map(Number);
        const so_gio = (h2 + m2 / 60) - (h1 + m1 / 60);
        if (so_ngay > 0 && so_gio > 0) {
          tong_tien_san = Math.round(so_ngay * so_gio * ctds.gia_thue_theo_gio + tien_phat);
        }
      }
      res.json({ success: true, so_gio_vuot, tien_phat, tong_tien_san });
    });
  });
});

module.exports = router;
