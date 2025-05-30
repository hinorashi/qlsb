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
router.get("/hoa-don/:phieu_dat_san_id", async (req, res) => {
  const { phieu_dat_san_id } = req.params;
  // Lấy danh sách hóa đơn và chi tiết đặt sân liên quan
  const sql = `
    SELECT hd.*, 
      ctds.id AS chi_tiet_dat_san_id, ctds.gio_bat_dau, ctds.gio_ket_thuc, ctds.gio_nhan_san, ctds.gio_tra_san, ctds.gia_thue_theo_gio,
      ctds.ngay_bat_dau, ctds.ngay_ket_thuc
    FROM hoa_don hd
    LEFT JOIN chi_tiet_dat_san ctds ON ctds.phieu_dat_san_id = hd.phieu_dat_san_id
    WHERE hd.phieu_dat_san_id = ?
  `;
  db.all(sql, [phieu_dat_san_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Tính toán số giờ vượt, tiền phạt, tổng tiền thuê sân thực tế bằng JS
    const result = rows.map((row) => {
      let so_gio_vuot = 0;
      let tien_phat = 0;
      let tong_tien_san = row.tien_thue_san || 0; // lấy đúng trường mới
      // Tính số giờ vượt và tiền phạt nếu có đủ thông tin
      if (row.gio_tra_san && row.gio_ket_thuc) {
        const [endHour, endMin] = row.gio_ket_thuc.split(":").map(Number);
        const [traHour, traMin] = row.gio_tra_san.split(":").map(Number);
        const endTime = endHour + endMin / 60;
        const traTime = traHour + traMin / 60;
        if (traTime > endTime) {
          so_gio_vuot = Math.ceil(traTime - endTime);
          tien_phat = so_gio_vuot * (row.gia_thue_theo_gio || 0);
        }
      }
      // Tổng tiền thuê sân thực tế = tiền thuê sân + tiền phạt (nếu có)
      if (tien_phat > 0) {
        tong_tien_san = (row.tien_thue_san || 0) + tien_phat;
      }
      return {
        ...row,
        so_gio_vuot,
        tien_phat,
        tong_tien_san,
      };
    });
    res.json(result);
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
      updateTongTienHoaDon(hoa_don_id);
      res.json({ id: this.lastID });
    }
  );
});

// 6. Sửa mặt hàng đã dùng
router.put("/mat-hang/:id", (req, res) => {
  const { id } = req.params;
  const { so_luong, gia_ban, thanh_tien } = req.body;
  db.get("SELECT hoa_don_id FROM chi_tiet_su_dung_mat_hang WHERE id = ?", [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Không tìm thấy mặt hàng" });
    db.run(
      "UPDATE chi_tiet_su_dung_mat_hang SET so_luong = ?, gia_ban = ?, thanh_tien = ? WHERE id = ?",
      [so_luong, gia_ban, thanh_tien, id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        updateTongTienHoaDon(row.hoa_don_id);
        res.json({ changes: this.changes });
      }
    );
  });
});

// 7. Xóa mặt hàng đã dùng
router.delete("/mat-hang/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT hoa_don_id FROM chi_tiet_su_dung_mat_hang WHERE id = ?", [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Không tìm thấy mặt hàng" });
    db.run(
      "DELETE FROM chi_tiet_su_dung_mat_hang WHERE id = ?",
      [id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        updateTongTienHoaDon(row.hoa_don_id);
        res.json({ changes: this.changes });
      }
    );
  });
});

// Sau khi thêm, sửa, xóa mặt hàng đã dùng, cập nhật lại tổng tiền mặt hàng vào hóa đơn
function updateTongTienHoaDon(hoa_don_id) {
  db.get(
    "SELECT tien_thue_san FROM hoa_don WHERE id = ?",
    [hoa_don_id],
    (err, hoaDonRow) => {
      if (err || !hoaDonRow) return;
      const tienThueSan = hoaDonRow.tien_thue_san || 0;
      db.get(
        "SELECT SUM(thanh_tien) AS tong_tien_mat_hang FROM chi_tiet_su_dung_mat_hang WHERE hoa_don_id = ?",
        [hoa_don_id],
        (err2, row) => {
          if (err2) return;
          const tongTienMatHang = row && row.tong_tien_mat_hang ? row.tong_tien_mat_hang : 0;
          const tongTien = tienThueSan + tongTienMatHang;
          db.run(
            "UPDATE hoa_don SET tong_tien = ? WHERE id = ?",
            [tongTien, hoa_don_id]
          );
        }
      );
    }
  );
}

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

// 9. Thanh toán hóa đơn (cập nhật số tiền thực trả, số tiền còn lại)
router.put("/hoa-don/:id/thanh-toan", (req, res) => {
  const { id } = req.params;
  const { so_tien_thuc_tra } = req.body;
  if (typeof so_tien_thuc_tra !== "number" || so_tien_thuc_tra < 0) {
    return res.status(400).json({ error: "Số tiền thực trả không hợp lệ" });
  }
  // Lấy tổng tiền hóa đơn
  db.get("SELECT tong_tien FROM hoa_don WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
    const so_tien_con_lai = Math.max(0, row.tong_tien - so_tien_thuc_tra);
    db.run(
      "UPDATE hoa_don SET so_tien_thuc_tra = ?, so_tien_con_lai = ? WHERE id = ?",
      [so_tien_thuc_tra, so_tien_con_lai, id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ id, so_tien_thuc_tra, so_tien_con_lai });
      }
    );
  });
});

// API cập nhật tổng tiền hóa đơn thủ công
router.put("/hoa-don/:id/tong-tien", (req, res) => {
  const { id } = req.params;
  const { tong_tien } = req.body;
  if (typeof tong_tien !== "number" || tong_tien < 0) {
    return res.status(400).json({ error: "Tổng tiền không hợp lệ" });
  }
  db.run(
    "UPDATE hoa_don SET tong_tien = ? WHERE id = ?",
    [tong_tien, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, tong_tien });
    }
  );
});

module.exports = router;
