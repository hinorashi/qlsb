"use client";
import React, { useState } from "react";
import {
  fetchCheckoutPhieuDatSan,
  fetchCheckoutHoaDon,
  fetchCheckoutMatHang,
  updateCheckoutMatHang,
  deleteCheckoutMatHang,
  thanhToanHoaDon,
} from "@/lib/api";
import type { CheckoutPhieuDatSan, CheckoutHoaDon, CheckoutMatHang } from "@/types/types";

export default function ThanhToanPage() {
  const [keyword, setKeyword] = useState("");
  const [phieuList, setPhieuList] = useState<CheckoutPhieuDatSan[]>([]);
  const [phieuChon, setPhieuChon] = useState<CheckoutPhieuDatSan | null>(null);
  const [hoaDonList, setHoaDonList] = useState<CheckoutHoaDon[]>([]);
  const [hoaDonChon, setHoaDonChon] = useState<CheckoutHoaDon | null>(null);
  const [matHangList, setMatHangList] = useState<CheckoutMatHang[]>([]);
  const [showEditMH, setShowEditMH] = useState<number|null>(null);
  const [editMH, setEditMH] = useState<{so_luong:number;gia_ban:number}|null>(null);
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
    setSoTienTra(hd.tong_tien || 0);
    setMessage("");
    const res = await fetchCheckoutMatHang(hd.id);
    setMatHangList(res);
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
      await thanhToanHoaDon(hoaDonChon.id, soTienTra);
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

  // Tính tổng tiền mặt hàng đã dùng
  const tongTienMatHang = matHangList.reduce((sum, mh) => sum + mh.so_luong * mh.gia_ban, 0);
  // Tính tổng tiền phải trả (tiền thuê sân + mặt hàng)
  const tongTienPhaiTra = (hoaDonChon?.tien_thue_san || 0) + tongTienMatHang;
  // Số tiền còn nợ hoặc dư
  const soTienConLai = soTienTra - tongTienPhaiTra;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Thanh toán hóa đơn</h2>
      <div className="mb-4 text-sm text-gray-700 bg-blue-50 border-l-4 border-blue-400 p-2 rounded">
        Số tiền cần thanh toán = <b>tiền thuê sân</b> +{" "}
        <b>tổng tiền các mặt hàng đã mua</b> trong buổi thuê.
      </div>
      {/* Bước 1: Tìm phiếu đặt sân */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleTimPhieu();
        }}
        className="flex gap-2 mb-2"
      >
        <input
          className="border px-2 py-1 rounded flex-1"
          placeholder="Nhập tên khách hàng để tìm phiếu đặt sân..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
          Tìm kiếm
        </button>
      </form>
      {/* Danh sách phiếu đặt sân */}
      {phieuList.length > 0 && (
        <ul className="mb-2">
          {phieuList.map(phieu => (
            <li key={phieu.id}>
              <button
                onClick={() => handleChonPhieu(phieu)}
                className={`px-3 py-1 rounded border w-full text-left ${phieuChon?.id === phieu.id ? "bg-blue-500 text-white" : ""}`}
              >
                #{phieu.id} - {phieu.ho_ten} ({phieu.sdt}) - Ngày đặt: {phieu.ngay_dat}
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Danh sách hóa đơn */}
      {phieuChon && (
        <div className="mb-2">
          <div className="font-semibold mb-1">Chọn hóa đơn:</div>
          <ul>
            {hoaDonList.map(hd => (
              <li key={hd.id}>
                <button
                  onClick={() => handleChonHoaDonFull(hd)}
                  className={`px-3 py-1 rounded border w-full text-left ${hoaDonChon?.id === hd.id ? "bg-blue-500 text-white" : ""}`}
                >
                  #{hd.id} - Ngày thanh toán: {hd.ngay_thanh_toan} - Tổng tiền: {hd.tong_tien?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Hiển thị bảng mặt hàng đã dùng */}
      {hoaDonChon && (
        <div className="mb-4">
          <div className="font-semibold mb-1">Mặt hàng đã dùng:</div>
          <table className="w-full table-auto border rounded shadow mb-2">
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
                      <input type="number" min={1} value={editMH?.so_luong} onChange={e=>setEditMH(editMH?{...editMH,so_luong:Number(e.target.value)}:null)} className="border px-1 w-16" />
                    ) : mh.so_luong}
                  </td>
                  <td className="p-2">
                    {showEditMH === mh.id ? (
                      <input type="number" min={0} value={editMH?.gia_ban} onChange={e=>setEditMH(editMH?{...editMH,gia_ban:Number(e.target.value)}:null)} className="border px-1 w-20" />
                    ) : mh.gia_ban.toLocaleString("vi-VN")}
                  </td>
                  <td className="p-2">{(mh.so_luong*mh.gia_ban).toLocaleString("vi-VN")}</td>
                  <td className="p-2">
                    {showEditMH === mh.id ? (
                      <>
                        <button onClick={()=>handleSaveEditMH(mh)} className="text-green-600 mr-2">Lưu</button>
                        <button onClick={()=>{setShowEditMH(null);setEditMH(null);}} className="text-gray-600">Hủy</button>
                      </>
                    ) : (
                      <>
                        <button onClick={()=>handleEditMH(mh)} className="text-blue-600 mr-2">Sửa</button>
                        <button onClick={()=>handleDeleteMH(mh.id)} className="text-red-600">Xóa</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Form thanh toán */}
      {hoaDonChon && (
        <div className="mb-2">
          <div className="font-semibold mb-1">Nhập số tiền khách trả:</div>
          <input
            type="number"
            min={0}
            max={tongTienPhaiTra}
            className="border px-2 py-1 rounded w-full mb-2"
            value={soTienTra}
            onChange={e => setSoTienTra(Number(e.target.value))}
          />
          <div className="mb-2 text-sm">
            <span>Tiền thuê sân: <b>{(hoaDonChon.tien_thue_san || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</b></span><br/>
            <span>Tổng tiền mặt hàng: <b>{tongTienMatHang.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</b></span><br/>
            <span>Tổng tiền phải trả: <b>{tongTienPhaiTra.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</b></span><br/>
            <span>Số tiền khách trả: <b>{soTienTra.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</b></span><br/>
            <span>{soTienConLai < 0 ? `Khách còn nợ: ${(Math.abs(soTienConLai)).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}` : soTienConLai > 0 ? `Khách dư: ${soTienConLai.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}` : "Đã thanh toán đủ"}</span>
          </div>
          <button
            onClick={handleThanhToan}
            className="bg-green-600 text-white px-4 py-1 rounded w-full"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </div>
      )}
      {message && <div className="p-2 bg-green-100 text-green-700 rounded mt-2">{message}</div>}
    </div>
  );
}
