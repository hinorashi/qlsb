"use client";
import React, { useState } from "react";
import {
  fetchCheckoutPhieuDatSan,
  fetchCheckoutHoaDon,
  fetchCheckoutMatHang,
  fetchCheckoutTimMatHang,
  createCheckoutMatHang,
  deleteCheckoutMatHang,
  fetchCheckoutTongTienMatHang,
  updateChiTietDatSan,
} from "@/lib/api";
import type { CheckoutPhieuDatSan, CheckoutHoaDon, CheckoutMatHang, MatHang } from "@/types/types";

export default function CheckoutPage() {
  // Bước 1: Tìm phiếu đặt sân theo tên khách hàng
  const [keyword, setKeyword] = useState("");
  const [phieuList, setPhieuList] = useState<CheckoutPhieuDatSan[]>([]);
  const [phieuChon, setPhieuChon] = useState<CheckoutPhieuDatSan | null>(null);
  const [hoaDonList, setHoaDonList] = useState<CheckoutHoaDon[]>([]);
  const [hoaDonChon, setHoaDonChon] = useState<CheckoutHoaDon | null>(null);
  const [matHangList, setMatHangList] = useState<CheckoutMatHang[]>([]);
  const [showAddMH, setShowAddMH] = useState(false);
  const [searchMH, setSearchMH] = useState("");
  const [dsMH, setDsMH] = useState<MatHang[]>([]);
  const [mhChon, setMhChon] = useState<MatHang | null>(null);
  const todayStr = new Date().toISOString().slice(0, 10);
  const [mhForm, setMhForm] = useState({
    so_luong: 1,
    gia_ban: 0,
    ngay_su_dung: todayStr,
  });
  const [tongTien, setTongTien] = useState(0);
  const [message, setMessage] = useState("");

  // Thông tin giờ nhận/trả sân và phạt
  const [gioNhanSan, setGioNhanSan] = useState("");
  const [gioTraSan, setGioTraSan] = useState("");
  const [tienPhat, setTienPhat] = useState(0);
  const [soGioVuot, setSoGioVuot] = useState(0);
  const [tongTienSan, setTongTienSan] = useState(0);
  const [chiTietDatSanId, setChiTietDatSanId] = useState<number | null>(null);
  const [tongTienMatHang, setTongTienMatHang] = useState(0);

  // Tìm phiếu đặt sân
  const handleTimPhieu = async () => {
    setPhieuChon(null);
    setHoaDonList([]);
    setHoaDonChon(null);
    setMatHangList([]);
    setShowAddMH(false);
    setMessage("");
    const res = await fetchCheckoutPhieuDatSan(keyword);
    setPhieuList(res);
  };

  // Chọn phiếu đặt sân
  const handleChonPhieu = async (phieu: CheckoutPhieuDatSan) => {
    setPhieuChon(phieu);
    setHoaDonChon(null);
    setMatHangList([]);
    setShowAddMH(false);
    setMessage("");
    const res = await fetchCheckoutHoaDon(phieu.id);
    setHoaDonList(res);
  };

  // Chọn hóa đơn (buổi thuê)
  const handleChonHoaDon = async (hd: CheckoutHoaDon) => {
    setHoaDonChon(hd);
    setShowAddMH(false);
    setMessage("");
    const res = await fetchCheckoutMatHang(hd.id);
    setMatHangList(res);
    // Lấy tổng tiền mặt hàng đã dùng
    const tong = await fetchCheckoutTongTienMatHang(hd.id);
    setTongTienMatHang(tong.tong_tien || 0);
    setMhForm(f => ({ ...f, ngay_su_dung: todayStr }));
    // Khi chọn hóa đơn, nếu có gio_bat_dau/gio_ket_thuc thì fill mặc định cho giờ nhận/trả sân
    if (hd.chi_tiet_dat_san_id) {
      setChiTietDatSanId(hd.chi_tiet_dat_san_id);
      setGioNhanSan(hd.gio_nhan_san || hd.gio_bat_dau || "");
      setGioTraSan(hd.gio_tra_san || hd.gio_ket_thuc || "");
      setTienPhat(hd.tien_phat || 0);
      setSoGioVuot(hd.so_gio_vuot || 0);
      setTongTienSan(hd.tong_tien_san || hd.tong_tien || 0);
    } else {
      setChiTietDatSanId(null);
      setGioNhanSan("");
      setGioTraSan("");
      setTienPhat(0);
      setSoGioVuot(0);
      setTongTienSan(hd.tong_tien || 0);
    }
  };

  // Tìm mặt hàng
  const handleTimMH = async () => {
    setMessage("");
    const res = await fetchCheckoutTimMatHang(searchMH);
    setDsMH(res);
    // Khi tìm mặt hàng, nếu chưa chọn ngày thì tự fill ngày hôm nay
    setMhForm(f => ({ ...f, ngay_su_dung: f.ngay_su_dung || todayStr }));
  };

  // Thêm mặt hàng đã dùng
  const handleThemMH = async () => {
    if (!hoaDonChon || !mhChon || !mhForm.ngay_su_dung) return;
    const thanh_tien = mhForm.so_luong * mhForm.gia_ban;
    await createCheckoutMatHang({
      hoa_don_id: hoaDonChon.id,
      ngay_su_dung: mhForm.ngay_su_dung,
      mat_hang_id: mhChon.id,
      so_luong: mhForm.so_luong,
      gia_ban: mhForm.gia_ban,
      thanh_tien,
    });
    setShowAddMH(false);
    setMhChon(null);
    setMhForm({ so_luong: 1, gia_ban: 0, ngay_su_dung: todayStr });
    // reload lại hóa đơn để cập nhật tổng tiền mặt hàng
    if (hoaDonChon) handleChonHoaDon(hoaDonChon);
    setMessage("Đã thêm mặt hàng!");
  };
  // Xóa mặt hàng đã dùng
  const handleXoaMH = async (id: number) => {
    await deleteCheckoutMatHang(id);
    if (hoaDonChon) handleChonHoaDon(hoaDonChon);
    setMessage("Đã xóa mặt hàng!");
  };

  // Hàm cập nhật giờ nhận/trả sân
  const handleCapNhatGio = async () => {
    if (!chiTietDatSanId || !hoaDonChon) return;
    setMessage("");
    try {
      await updateChiTietDatSan(chiTietDatSanId, { gio_nhan_san: gioNhanSan, gio_tra_san: gioTraSan });
      // Sau khi cập nhật giờ, reload lại hóa đơn để lấy đúng tổng tiền thuê sân đã tính phạt
      await handleChonHoaDon(hoaDonChon);
      setMessage("Đã cập nhật giờ nhận/trả sân!");
    } catch (e) {
      setMessage("Cập nhật thất bại!");
    }
  };

  // Tính tổng tiền thanh toán cuối cùng
  const tongTienThanhToan = tongTienSan + tongTienMatHang;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Checkout buổi thuê & cập nhật mặt hàng đã dùng
      </h2>
      {/* Bước 1: Tìm phiếu đặt sân */}
      <div className="mb-4 border-b pb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTimPhieu();
          }}
          className="flex gap-2 mb-2"
        >
          <input
            className="border px-2 py-1 rounded flex-1"
            placeholder="Nhập tên khách hàng để tìm phiếu đặt sân..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Tìm phiếu
          </button>
        </form>
        {phieuList.length > 0 && (
          <div className="mt-2">
            <div className="font-semibold mb-1">Chọn phiếu đặt sân:</div>
            <ul className="flex flex-col gap-2">
              {phieuList.map((phieu) => (
                <li key={phieu.id}>
                  <button
                    onClick={() => handleChonPhieu(phieu)}
                    className={`px-3 py-1 rounded border w-full text-left ${phieuChon?.id === phieu.id ? "bg-green-500 text-white" : ""
                      }`}
                  >
                    #{phieu.id} - {phieu.ho_ten} ({phieu.sdt}) - Ngày đặt: {phieu.ngay_dat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Bước 2: Chọn hóa đơn (buổi thuê) */}
      {phieuChon && (
        <div className="mb-4 border-b pb-4">
          <div className="font-semibold mb-1">Chọn hóa đơn (buổi thuê):</div>
          <ul className="flex flex-col gap-2">
            {hoaDonList.map((hd) => (
              <li key={hd.id}>
                <button
                  onClick={() => handleChonHoaDon(hd)}
                  className={`px-3 py-1 rounded border w-full text-left ${hoaDonChon?.id === hd.id ? "bg-blue-500 text-white" : ""
                    }`}
                >
                  #{hd.id} - Ngày thanh toán: {hd.ngay_thanh_toan} - Tổng tiền: {hd.tong_tien?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Bước 3: Quản lý mặt hàng đã dùng */}
      {hoaDonChon && (
        <div className="mb-4 border-b pb-4">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-semibold">Mặt hàng đã dùng:</span>
            <button
              onClick={() => setShowAddMH(true)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              + Thêm mặt hàng
            </button>
            <span className="ml-auto font-semibold">
              Tổng tiền: {" "}
              <b>
                {tongTienMatHang?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </b>
            </span>
          </div>
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
                <tr key={mh.id} className="border-t">
                  <td className="p-2">{mh.ten_mat_hang}</td>
                  <td className="p-2">{mh.don_vi}</td>
                  <td className="p-2">{mh.ngay_su_dung}</td>
                  <td className="p-2">{mh.so_luong}</td>
                  <td className="p-2">
                    {mh.gia_ban?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="p-2">
                    {mh.thanh_tien?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="p-2">
                    <button
                      className="bg-red-600 px-2 py-1 rounded text-white"
                      onClick={() => handleXoaMH(mh.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Thêm mặt hàng mới */}
          {showAddMH && (
            <div className="mb-4 p-4 bg-gray-50 rounded shadow">
              <div className="font-semibold mb-2">Thêm mặt hàng đã dùng</div>
              <div className="flex gap-2 mb-2">
                <input
                  className="border px-2 py-1 rounded flex-1"
                  placeholder="Tìm mặt hàng..."
                  value={searchMH}
                  onChange={(e) => {
                    setSearchMH(e.target.value);
                    setMessage("");
                  }}
                />
                <button
                  onClick={handleTimMH}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Tìm
                </button>
              </div>
              {dsMH.length > 0 && (
                <ul className="flex flex-col gap-2 mb-2">
                  {dsMH.map((mh) => (
                    <li key={mh.id}>
                      <button
                        onClick={() => {
                          setMhChon(mh);
                          setMhForm((f) => ({ ...f, gia_ban: mh.gia_ban }));
                          setMessage("");
                        }}
                        className={`px-3 py-1 rounded border w-full text-left ${mhChon?.id === mh.id ? "bg-green-500 text-white" : ""
                          }`}
                      >
                        {mh.ten} ({mh.don_vi}) - Giá:
                        {mh.gia_ban?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {mhChon && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Ngày sử dụng</label>
                    <input
                      type="date"
                      className="border px-2 py-1 rounded"
                      value={mhForm.ngay_su_dung}
                      onChange={(e) =>
                        setMhForm((f) => ({ ...f, ngay_su_dung: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Số lượng</label>
                    <input
                      type="number"
                      min={1}
                      className="border px-2 py-1 rounded"
                      value={mhForm.so_luong}
                      onChange={(e) =>
                        setMhForm((f) => ({
                          ...f,
                          so_luong: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Giá bán</label>
                    <input
                      type="number"
                      min={0}
                      className="border px-2 py-1 rounded"
                      value={mhForm.gia_ban}
                      onChange={(e) =>
                        setMhForm((f) => ({ ...f, gia_ban: Number(e.target.value) }))
                      }
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleThemMH}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                  disabled={!mhChon || !mhForm.ngay_su_dung}
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setShowAddMH(false);
                    setMhChon(null);
                    setMhForm({ so_luong: 1, gia_ban: 0, ngay_su_dung: todayStr });
                    setMessage("");
                  }}
                  className="bg-gray-400 text-white px-4 py-1 rounded"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
          {/* Bổ sung form nhập giờ nhận/trả sân */}
          <div className="flex flex-col md:flex-row gap-4 items-end mb-2 bg-gray-50 p-3 rounded shadow">
            <div className="flex flex-col">
              <label className="text-xs font-medium mb-1">Giờ nhận sân</label>
              <input type="time" value={gioNhanSan} onChange={e => setGioNhanSan(e.target.value)} className="border rounded px-2 py-1" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium mb-1">Giờ trả sân</label>
              <input type="time" value={gioTraSan} onChange={e => setGioTraSan(e.target.value)} className="border rounded px-2 py-1" />
            </div>
            <button onClick={handleCapNhatGio} className="bg-blue-600 text-white px-4 py-1 rounded">Lưu/Cập nhật giờ</button>
            <div className="flex flex-col ml-4">
              <span className="text-xs">Số giờ vượt: <b>{soGioVuot}</b></span>
              <span className="text-xs">Tiền phạt: <b>{tienPhat.toLocaleString('vi-VN')}đ</b></span>
            </div>
          </div>
          <div className="font-semibold mb-2">Tiền thuê sân (đã tính phạt nếu có): <b>{tongTienSan.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></div>
          <div className="font-semibold mb-2">Tiền mặt hàng đã dùng: <b>{tongTienMatHang.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></div>
          <div className="font-bold text-lg mb-2 text-blue-700">TỔNG TIỀN THANH TOÁN: <b>{tongTienThanhToan.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></div>
        </div>
      )}
      {message && (
        <div className="p-2 bg-green-100 text-green-700 rounded mt-2">
          {message}
        </div>
      )}
    </div>
  );
}
