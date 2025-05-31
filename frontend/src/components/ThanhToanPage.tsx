"use client";
import React, { useState } from "react";
import {
  fetchCheckoutPhieuDatSan,
  fetchCheckoutHoaDon,
  fetchCheckoutMatHang,
  updateCheckoutMatHang,
  deleteCheckoutMatHang,
  thanhToanHoaDon,
  createCheckoutMatHangAndUpdateTongTien,
} from "@/lib/api";
import type { CheckoutPhieuDatSan, CheckoutHoaDon, CheckoutMatHang } from "@/types/types";

export default function ThanhToanPage() {
  const [keyword, setKeyword] = useState("");
  const [phieuList, setPhieuList] = useState<CheckoutPhieuDatSan[]>([]);
  const [phieuChon, setPhieuChon] = useState<CheckoutPhieuDatSan | null>(null);
  const [hoaDonList, setHoaDonList] = useState<CheckoutHoaDon[]>([]);
  const [hoaDonChon, setHoaDonChon] = useState<CheckoutHoaDon | null>(null);
  const [matHangList, setMatHangList] = useState<CheckoutMatHang[]>([]);
  const [showEditMH, setShowEditMH] = useState<number | null>(null);
  const [editMH, setEditMH] = useState<{ so_luong: number; gia_ban: number } | null>(null);
  const [soTienTra, setSoTienTra] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Tìm phiếu đặt sân
  const handleTimPhieu = async () => {
    setPhieuChon(null);
    setHoaDonList([]);
    setHoaDonChon(null);
    setMessage("");
    const res = await fetchCheckoutPhieuDatSan(keyword);
    setPhieuList(res);
  };

  // Chọn phiếu đặt sân
  const handleChonPhieu = async (phieu: CheckoutPhieuDatSan) => {
    setPhieuChon(phieu);
    setHoaDonChon(null);
    setMessage("");
    const res = await fetchCheckoutHoaDon(phieu.id);
    setHoaDonList(res);
  };

  // Khi chọn hóa đơn, lấy danh sách mặt hàng đã dùng
  const handleChonHoaDonFull = async (hd: CheckoutHoaDon) => {
    setHoaDonChon(hd);
    setMessage("");
    const res = await fetchCheckoutMatHang(hd.id);
    setMatHangList(res);
    // Auto fill số tiền trả lần này bằng số tiền còn nợ
    const tongTienMatHang = res.reduce((sum: number, mh: CheckoutMatHang) => sum + mh.so_luong * mh.gia_ban, 0);
    const tongTienPhaiTra = (hd.tien_thue_san || 0) + tongTienMatHang;
    const soTienDaTra = hd.so_tien_thuc_tra || 0;
    setSoTienTra(tongTienPhaiTra - soTienDaTra > 0 ? tongTienPhaiTra - soTienDaTra : 0);
  };

  // Chọn hóa đơn
  const handleChonHoaDon = (hd: CheckoutHoaDon) => {
    setHoaDonChon(hd);
    setSoTienTra(hd.tong_tien || 0);
    setMessage("");
  };

  // Thanh toán
  const handleThanhToan = async () => {
    if (!hoaDonChon) return;
    setLoading(true);
    setMessage("");
    try {
      // Số tiền thực trả mới = số tiền đã trả trước đó + số tiền trả lần này
      const soTienThucTraMoi = (hoaDonChon.so_tien_thuc_tra || 0) + soTienTra;
      await thanhToanHoaDon(hoaDonChon.id, soTienThucTraMoi);
      // Sau khi thanh toán, reload lại hóa đơn và mặt hàng để cập nhật số tiền thực trả, tổng tiền, v.v.
      const [hoaDonListRes, matHangListRes] = await Promise.all([
        fetchCheckoutHoaDon(phieuChon!.id),
        fetchCheckoutMatHang(hoaDonChon.id)
      ]);
      setHoaDonList(hoaDonListRes);
      const updatedHoaDon = hoaDonListRes.find((hd: CheckoutHoaDon) => hd.id === hoaDonChon.id) || hoaDonChon;
      setHoaDonChon(updatedHoaDon);
      setMatHangList(matHangListRes);
      setMessage("Thanh toán thành công!");
    } catch (e) {
      setMessage("Thanh toán thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Sửa mặt hàng đã dùng
  const handleEditMH = (mh: CheckoutMatHang) => {
    setShowEditMH(mh.id);
    setEditMH({ so_luong: mh.so_luong, gia_ban: mh.gia_ban });
  };
  const handleSaveEditMH = async (mh: CheckoutMatHang) => {
    if (!editMH) return;
    await updateCheckoutMatHang(mh.id, {
      so_luong: editMH.so_luong,
      gia_ban: editMH.gia_ban,
      thanh_tien: editMH.so_luong * editMH.gia_ban,
    });
    const res = await fetchCheckoutMatHang(hoaDonChon!.id);
    setMatHangList(res);
    setShowEditMH(null);
    setEditMH(null);
  };
  const handleDeleteMH = async (id: number) => {
    await deleteCheckoutMatHang(id);
    const res = await fetchCheckoutMatHang(hoaDonChon!.id);
    setMatHangList(res);
  };

  // Thêm mặt hàng đã dùng
  const handleAddMatHang = async (data: {
    hoa_don_id: number;
    ngay_su_dung: string;
    mat_hang_id: number;
    so_luong: number;
    gia_ban: number;
    thanh_tien: number;
  }) => {
    await createCheckoutMatHangAndUpdateTongTien(data);
    const res = await fetchCheckoutMatHang(data.hoa_don_id);
    setMatHangList(res);
  };

  // Tính tổng tiền mặt hàng đã dùng
  const tongTienMatHang = matHangList.reduce((sum, mh) => sum + mh.so_luong * mh.gia_ban, 0);
  // Tính tổng tiền phải trả (tiền thuê sân + mặt hàng)
  const tongTienPhaiTra = (hoaDonChon?.tien_thue_san || 0) + tongTienMatHang;
  // Số tiền đã trả thực tế (ưu tiên lấy từ DB nếu đã thanh toán)
  const soTienDaTra = hoaDonChon?.so_tien_thuc_tra != null ? hoaDonChon.so_tien_thuc_tra : 0;
  // Số tiền còn nợ
  const soTienConNo = tongTienPhaiTra - soTienDaTra;
  // Số tiền còn lại/dư sau lần trả này
  const soTienSauLanTra = soTienDaTra + soTienTra - tongTienPhaiTra;

  // Khi số tiền còn nợ = 0, tự động clear số tiền khách trả lần này
  React.useEffect(() => {
    if (soTienConNo === 0 && soTienTra !== 0) {
      setSoTienTra(0);
    }
  }, [soTienConNo, soTienTra]);

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-1 text-center">Thanh toán hóa đơn thuê sân</h1>
      <p className="text-gray-500 dark:text-gray-300 text-center mb-6">Quản lý thanh toán, cập nhật trạng thái hóa đơn và số tiền khách trả.</p>
      <div className="mb-6 text-sm text-gray-700 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
        Số tiền cần thanh toán = <b>tiền thuê sân</b> + <b>tổng tiền các mặt hàng đã mua</b> trong buổi thuê.
      </div>
      {/* Bước 1: Tìm phiếu đặt sân */}
      <section className="mb-6 border-b pb-6">
        <h2 className="text-lg font-semibold mb-3">Bước 1: Tìm phiếu đặt sân</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleTimPhieu();
          }}
          className="flex gap-3 mb-3"
        >
          <input
            className="border px-2 py-1 rounded flex-1 min-w-[220px]"
            placeholder="Nhập tên khách hàng để tìm phiếu đặt sân..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow">
            Tìm kiếm
          </button>
        </form>
        {phieuList.length > 0 && (
          <ul className="flex flex-col gap-2 mt-2">
            {phieuList.map(phieu => (
              <li key={phieu.id}>
                <button
                  onClick={() => handleChonPhieu(phieu)}
                  className={`px-4 py-2 rounded border w-full text-left font-medium transition-colors duration-150 ${phieuChon?.id === phieu.id ? "bg-blue-500 text-white border-blue-600" : "hover:bg-gray-100"}`}
                >
                  #{phieu.id} - {phieu.ho_ten} <span className="text-xs text-gray-500">({phieu.sdt})</span> - Ngày đặt: {phieu.ngay_dat}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* Bước 2: Chọn hóa đơn */}
      {phieuChon && (
        <section className="mb-6 border-b pb-6">
          <h2 className="text-lg font-semibold mb-3">Bước 2: Chọn hóa đơn</h2>
          <ul className="flex flex-col gap-2">
            {hoaDonList.map(hd => (
              <li key={hd.id}>
                <button
                  onClick={() => handleChonHoaDonFull(hd)}
                  className={`px-4 py-2 rounded border w-full text-left font-medium transition-colors duration-150 ${hoaDonChon?.id === hd.id ? "bg-blue-500 text-white border-blue-600" : "hover:bg-gray-100"}`}
                >
                  #{hd.id} - Ngày thanh toán: {hd.ngay_thanh_toan} - Tổng tiền: {hd.tong_tien?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {/* Bước 3: Kiểm tra mặt hàng đã dùng */}
      {hoaDonChon && (
        <section className="mb-6 border-b pb-6">
          <h2 className="text-lg font-semibold mb-3">Bước 3: Kiểm tra mặt hàng đã dùng</h2>
          <table className="w-full table-auto border rounded shadow mb-3">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Tên mặt hàng</th>
                <th className="p-2">Đơn vị</th>
                <th className="p-2">Ngày sử dụng</th>
                <th className="p-2">Số lượng</th>
                <th className="p-2">Giá bán</th>
                <th className="p-2">Thành tiền</th>
                <th className="p-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {matHangList.map((mh) => (
                <tr key={mh.id}>
                  <td className="p-2">{mh.ten_mat_hang}</td>
                  <td className="p-2">{mh.don_vi}</td>
                  <td className="p-2">{mh.ngay_su_dung}</td>
                  <td className="p-2">
                    {showEditMH === mh.id ? (
                      <input type="number" min={1} value={editMH?.so_luong} onChange={e => setEditMH(editMH ? { ...editMH, so_luong: Number(e.target.value) } : null)} className="border px-1 w-16" />
                    ) : mh.so_luong}
                  </td>
                  <td className="p-2">
                    {showEditMH === mh.id ? (
                      <input type="number" min={0} value={editMH?.gia_ban} onChange={e => setEditMH(editMH ? { ...editMH, gia_ban: Number(e.target.value) } : null)} className="border px-1 w-20" />
                    ) : mh.gia_ban.toLocaleString("vi-VN")}
                  </td>
                  <td className="p-2">{(mh.so_luong * mh.gia_ban).toLocaleString("vi-VN")}</td>
                  <td className="p-2">
                    {showEditMH === mh.id ? (
                      <>
                        <button onClick={() => handleSaveEditMH(mh)} className="text-green-600 mr-2">Lưu</button>
                        <button onClick={() => { setShowEditMH(null); setEditMH(null); }} className="text-gray-600">Hủy</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditMH(mh)} className="text-blue-600 mr-2">Sửa</button>
                        <button onClick={() => handleDeleteMH(mh.id)} className="text-red-600">Xóa</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {/* Bước 4: Thanh toán */}
      {hoaDonChon && (
        <section className="mb-6 border-b pb-6">
          <h2 className="text-lg font-semibold mb-3">Bước 4: Thanh toán</h2>
          <div className="mb-3 text-sm">
            <span>Tiền thuê sân: <b>{(hoaDonChon.tien_thue_san || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</b></span><br />
            <span>Tổng tiền mặt hàng: <b>{tongTienMatHang.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</b></span><br />
            <span>Tổng tiền phải trả: <b>{tongTienPhaiTra.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</b></span><br />
            <span>Số tiền đã trả: <b>{soTienDaTra.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</b></span><br />
            <span>Số tiền còn nợ: <b>{soTienConNo > 0 ? soTienConNo.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "0 đ"}</b></span><br />
          </div>
          <div className="font-semibold mb-1">Nhập số tiền khách trả (lần này):</div>
          <input
            type="number"
            min={0}
            max={soTienConNo}
            className="border px-2 py-1 rounded w-full mb-2"
            value={soTienTra}
            onChange={e => setSoTienTra(Number(e.target.value))}
          />
          <div className="mb-2 text-sm">
            <span>Dự đoán:</span><br />
            <span>
              {soTienSauLanTra > 1000
                ? `Khách sẽ trả dư: ${soTienSauLanTra.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`
                : soTienSauLanTra < -1000
                  ? `Khách sẽ còn nợ: ${(Math.abs(soTienSauLanTra)).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`
                  : "Thanh toán đủ"}
            </span>
          </div>
          <button
            onClick={handleThanhToan}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold w-full shadow"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </section>
      )}
      {message && <div className="p-4 bg-green-100 text-green-700 rounded text-center font-semibold mt-4">{message}</div>}
    </div>
  );
}
