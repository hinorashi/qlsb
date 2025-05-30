const express = require("express");
const router = express.Router();
const db = require("../database");

// 1. Tìm phiếu đặt sân theo tên khách hàng
router.get("/phieu-dat-san", (req, res) => {
  const { tukhoa } = req.query;
  let sql = `
    SELECT pds.*, kh.ho_ten, kh.sdt
    FROM phieu_dat_san pds
    JOIN khach_hang kh ON pds.khach_hang_id = kh.id
  `;
  let params = [];
  if (tukhoa) {
    sql += " WHERE kh.ho_ten LIKE ?";
    params.push(`%${tukhoa}%`);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. Lấy danh sách hóa đơn (buổi thuê) của một phiếu đặt sân
router.get("/hoa-don/:phieu_dat_san_id", (req, res) => {
  const { phieu_dat_san_id } = req.params;
  const sql = `
    SELECT * FROM hoa_don WHERE phieu_dat_san_id = ?
  `;
  db.all(sql, [phieu_dat_san_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 3. Lấy danh sách mặt hàng đã dùng của một hóa đơn
router.get("/mat-hang/:hoa_don_id", (req, res) => {
  const { hoa_don_id } = req.params;
  const sql = `
    SELECT ctsdmh.*, mh.ten AS ten_mat_hang, mh.don_vi
    FROM chi_tiet_su_dung_mat_hang ctsdmh
    JOIN mat_hang mh ON ctsdmh.mat_hang_id = mh.id
    WHERE ctsdmh.hoa_don_id = ?
  `;
  db.all(sql, [hoa_don_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 4. Tìm mặt hàng theo tên
router.get("/tim-mat-hang", (req, res) => {
  const { tukhoa } = req.query;
  const sql = `SELECT * FROM mat_hang WHERE ten LIKE ?`;
  db.all(sql, [`%${tukhoa || ""}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 5. Thêm mặt hàng đã dùng cho hóa đơn
router.post("/mat-hang", (req, res) => {
  const {
    hoa_don_id,
    ngay_su_dung,
    mat_hang_id,
    so_luong,
    gia_ban,
    thanh_tien,
  } = req.body;
  if (
    !hoa_don_id ||
    !ngay_su_dung ||
    !mat_hang_id ||
    !so_luong ||
    !gia_ban ||
    !thanh_tien
  ) {
    return res.status(400).json({ error: "Thiếu thông tin" });
  }
  db.run(
    "INSERT INTO chi_tiet_su_dung_mat_hang (hoa_don_id, ngay_su_dung, mat_hang_id, so_luong, gia_ban, thanh_tien) VALUES (?, ?, ?, ?, ?, ?)",
    [hoa_don_id, ngay_su_dung, mat_hang_id, so_luong, gia_ban, thanh_tien],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// 6. Sửa mặt hàng đã dùng
router.put("/mat-hang/:id", (req, res) => {
  const { id } = req.params;
  const { so_luong, gia_ban, thanh_tien } = req.body;
  db.run(
    "UPDATE chi_tiet_su_dung_mat_hang SET so_luong = ?, gia_ban = ?, thanh_tien = ? WHERE id = ?",
    [so_luong, gia_ban, thanh_tien, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// 7. Xóa mặt hàng đã dùng
router.delete("/mat-hang/:id", (req, res) => {
  const { id } = req.params;
  db.run(
    "DELETE FROM chi_tiet_su_dung_mat_hang WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// 8. Tính tổng tiền mặt hàng đã dùng của một hóa đơn
router.get("/mat-hang/:hoa_don_id/tong-tien", (req, res) => {
  const { hoa_don_id } = req.params;
  db.get(
    "SELECT SUM(thanh_tien) AS tong_tien FROM chi_tiet_su_dung_mat_hang WHERE hoa_don_id = ?",
    [hoa_don_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

module.exports = router;
