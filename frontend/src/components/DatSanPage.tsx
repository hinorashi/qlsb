"use client";
import React, { useState } from 'react';
import {
  fetchSanTrong,
  fetchKhachHang,
  createKhachHang,
  createPhieuDatSan,
  createChiTietDatSan,
  tinhTienChiTietDatSan,
} from "@/lib/api";
import type { SanBong, KhachHang } from "@/types/types";

// UI cho quy trình đặt sân: tìm sân trống, chọn khách, nhập thời gian, xác nhận đặt
export default function DatSanPage() {
  // Bước 1: Tìm sân trống
  const [loaiSan, setLoaiSan] = useState('7');
  const [gioBatDau, setGioBatDau] = useState('18:00');
  const [gioKetThuc, setGioKetThuc] = useState('20:00');
  const [ngayBatDau, setNgayBatDau] = useState('');
  const [ngayKetThuc, setNgayKetThuc] = useState('');
  const [sanTrong, setSanTrong] = useState<SanBong[]>([]);
  const [sanChon, setSanChon] = useState<SanBong | null>(null);

  // Bước 2: Tìm/Chọn khách hàng
  const [tenKhach, setTenKhach] = useState('');
  const [dsKhach, setDsKhach] = useState<KhachHang[]>([]);
  const [khachChon, setKhachChon] = useState<KhachHang | null>(null);
  const [showThemKhach, setShowThemKhach] = useState(false);
  const [newKhach, setNewKhach] = useState({ ho_ten: '', sdt: '', email: '' });

  // Bước 3: Xác nhận đặt sân
  // Không nhập giá thuê, lấy từ sân đã chọn
  const [giaThue, setGiaThue] = useState<number | null>(null);
  const [tongTien, setTongTien] = useState<number | null>(null);
  const [tienCoc, setTienCoc] = useState<number | null>(null);
  const [phieuId, setPhieuId] = useState(null);
  const [chiTietId, setChiTietId] = useState(null);
  const [ketQua, setKetQua] = useState('');

  // Lưu số buổi đã tính được từ API (nếu có)
  const [soBuoi, setSoBuoi] = useState<number | null>(null);

  // Tìm sân trống
  const handleTimSan = async () => {
    setKetQua("");
    setSanChon(null);
    setSanTrong([]);
    if (!loaiSan || !gioBatDau || !gioKetThuc || !ngayBatDau || !ngayKetThuc) return;
    const data = await fetchSanTrong({
      loai_san: loaiSan,
      gio_bat_dau: gioBatDau,
      gio_ket_thuc: gioKetThuc,
      ngay_bat_dau: ngayBatDau,
      ngay_ket_thuc: ngayKetThuc,
    });
    setSanTrong(data);
  };

  // Khi chọn sân, tự động load toàn bộ khách hàng
  React.useEffect(() => {
    if (sanChon) {
      fetchKhachHang().then(setDsKhach);
    }
  }, [sanChon]);

  // Tìm khách hàng
  const handleTimKhach = async () => {
    setKhachChon(null);
    setDsKhach([]);
    const data = await fetchKhachHang(tenKhach || undefined);
    setDsKhach(data);
  };

  // Thêm mới khách hàng
  const handleThemKhach = async () => {
    if (!newKhach.ho_ten || !newKhach.sdt) return;
    const res = await createKhachHang(newKhach);
    setKhachChon({ id: res.id, ...newKhach });
    setShowThemKhach(false);
    // Reload lại danh sách khách hàng để hiển thị khách mới
    const data = await fetchKhachHang(tenKhach || undefined);
    setDsKhach(data);
  };

  // Tính số giờ từ giờ bắt đầu/kết thúc
  function tinhSoGio(gioBatDau: string, gioKetThuc: string): number {
    const [h1, m1] = gioBatDau.split(":").map(Number);
    const [h2, m2] = gioKetThuc.split(":").map(Number);
    const diff = (h2 + m2 / 60) - (h1 + m1 / 60);
    return diff > 0 ? diff : 0;
  }

  // Tính số buổi (số ngày)
  function tinhSoBuoi(ngayBatDau: string, ngayKetThuc: string): number {
    if (!ngayBatDau || !ngayKetThuc) return 0;
    const d1 = new Date(ngayBatDau);
    const d2 = new Date(ngayKetThuc);
    const diff = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  }

  // Khi chọn sân hoặc thay đổi giờ/ngày, chỉ tính toán tổng tiền, đặt cọc, số buổi trên UI (KHÔNG gọi API tạo chi tiết đặt sân ở đây)
  React.useEffect(() => {
    setKetQua("");
    if (sanChon) {
      setGiaThue(null);
      const soGio = tinhSoGio(gioBatDau, gioKetThuc);
      // Giá thuê 1 buổi = số giờ * giá thuê theo giờ
      const giaMotBuoi = soGio > 0 ? Math.round(soGio * sanChon.gia_thue_theo_gio) : sanChon.gia_thue_theo_gio;
      setGiaThue(giaMotBuoi);
      // Tổng tiền = số buổi * giá thuê 1 buổi
      const soNgay = tinhSoBuoi(ngayBatDau, ngayKetThuc);
      if (ngayBatDau && ngayKetThuc && typeof giaMotBuoi === "number" && soNgay > 0) {
        const tong = giaMotBuoi * soNgay;
        setTongTien(tong);
        setTienCoc(Math.round(tong * 0.1));
        setSoBuoi(soNgay);
      } else {
        setTongTien(null);
        setTienCoc(null);
        setSoBuoi(null);
      }
    } else {
      setGiaThue(null);
      setTongTien(null);
      setTienCoc(null);
      setSoBuoi(null);
    }
  }, [sanChon, gioBatDau, gioKetThuc, ngayBatDau, ngayKetThuc]);

  // Lưu phiếu đặt sân
  const handleDatSan = async () => {
    if (!khachChon || !sanChon || typeof tongTien !== "number" || typeof tienCoc !== "number") return;
    setKetQua("");
    const res = await createPhieuDatSan({
      khach_hang_id: khachChon.id,
      tong_tien_du_kien: tongTien,
      tien_dat_coc: tienCoc,
    });
    setPhieuId(res.id);
    await createChiTietDatSan({
      phieu_dat_san_id: res.id,
      san_bong_id: sanChon.id,
      gio_bat_dau: gioBatDau,
      gio_ket_thuc: gioKetThuc,
      ngay_bat_dau: ngayBatDau,
      ngay_ket_thuc: ngayKetThuc,
      gia_thue_theo_gio: typeof giaThue === "number" ? giaThue : 0,
    });
    setKetQua("Đặt sân thành công!");
  };

  React.useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    setNgayBatDau(dateStr);
    setNgayKetThuc(dateStr);
  }, []);

  // Clear thông báo khi đổi thao tác
  React.useEffect(() => {
    setKetQua("");
  }, [sanChon, gioBatDau, gioKetThuc, ngayBatDau, ngayKetThuc, tenKhach, khachChon]);

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-1 text-center">Đặt sân bóng mini</h1>
      <p className="text-gray-500 dark:text-gray-300 text-center mb-6">Chọn sân, xem lịch trống, đặt lịch và xác nhận.</p>
      {/* Bước 1: Tìm sân trống */}
      <section className="mb-6 border-b pb-6">
        <h2 className="text-lg font-semibold mb-3">Bước 1: Tìm sân trống</h2>
        <div className="flex flex-wrap gap-4 mb-3 items-end">
          <div className="flex flex-col min-w-[120px]">
            <label className="text-xs font-medium mb-1">Loại sân</label>
            <select value={loaiSan} onChange={e => setLoaiSan(e.target.value)} className="border rounded px-2 py-1">
              <option value="7">Sân 7</option>
              <option value="11">Sân 11</option>
            </select>
          </div>
          <div className="flex flex-col min-w-[120px]">
            <label className="text-xs font-medium mb-1">Giờ bắt đầu</label>
            <input type="time" value={gioBatDau} onChange={e => setGioBatDau(e.target.value)} className="border rounded px-2 py-1" />
          </div>
          <div className="flex flex-col min-w-[120px]">
            <label className="text-xs font-medium mb-1">Giờ kết thúc</label>
            <input type="time" value={gioKetThuc} onChange={e => setGioKetThuc(e.target.value)} className="border rounded px-2 py-1" />
          </div>
          <div className="flex flex-col min-w-[150px]">
            <label className="text-xs font-medium mb-1">Ngày bắt đầu</label>
            <input type="date" value={ngayBatDau} onChange={e => setNgayBatDau(e.target.value)} className="border rounded px-2 py-1" />
          </div>
          <div className="flex flex-col min-w-[150px]">
            <label className="text-xs font-medium mb-1">Ngày kết thúc</label>
            <input type="date" value={ngayKetThuc} onChange={e => setNgayKetThuc(e.target.value)} className="border rounded px-2 py-1" />
          </div>
          <button onClick={handleTimSan} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow">Tìm sân</button>
        </div>
        {sanTrong.length > 0 && (
          <div className="mt-2">
            <div className="font-semibold mb-2">Chọn sân:</div>
            <ul className="flex flex-wrap gap-3">
              {sanTrong.map(san => (
                <li key={san.id}>
                  <button
                    onClick={() => setSanChon(san)}
                    className={`px-4 py-2 rounded border font-medium transition-colors duration-150 ${sanChon?.id === san.id ? 'bg-green-500 text-white border-green-600' : 'hover:bg-gray-100'}`}
                  >
                    {san.ten_san} <span className="text-xs text-gray-500">({san.gia_thue_theo_gio?.toLocaleString('vi-VN')}đ/giờ)</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      {/* Bước 2: Tìm/chọn khách hàng */}
      {sanChon && (
        <section className="mb-6 border-b pb-6">
          <h2 className="text-lg font-semibold mb-3">Bước 2: Chọn khách hàng</h2>
          <div className="flex flex-wrap gap-3 mb-3">
            <input type="text" value={tenKhach} onChange={e => setTenKhach(e.target.value)} placeholder="Tên khách hàng" className="border rounded px-2 py-1 min-w-[180px]" />
            <button onClick={handleTimKhach} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow">Tìm khách</button>
            <button onClick={() => setShowThemKhach(true)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold shadow">Thêm mới</button>
          </div>
          {dsKhach.length > 0 && (
            <ul className="flex flex-col gap-2">
              {dsKhach.map(kh => (
                <li key={kh.id}>
                  <button onClick={() => setKhachChon(kh)} className={`px-4 py-2 rounded border w-full text-left font-medium transition-colors duration-150 ${khachChon?.id === kh.id ? 'bg-green-500 text-white border-green-600' : 'hover:bg-gray-100'}`}>
                    {kh.ho_ten} <span className="text-xs text-gray-500">({kh.sdt})</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {showThemKhach && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded shadow w-full">
              <div className="flex flex-col">
                <label className="text-xs font-medium mb-1">Họ tên</label>
                <input type="text" placeholder="Họ tên" value={newKhach.ho_ten} onChange={e => setNewKhach(k => ({ ...k, ho_ten: e.target.value }))} className="border rounded px-2 py-1" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-medium mb-1">SĐT</label>
                <input type="text" placeholder="SĐT" value={newKhach.sdt} onChange={e => setNewKhach(k => ({ ...k, sdt: e.target.value }))} className="border rounded px-2 py-1" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-medium mb-1">Email</label>
                <input type="email" placeholder="Email" value={newKhach.email} onChange={e => setNewKhach(k => ({ ...k, email: e.target.value }))} className="border rounded px-2 py-1" />
              </div>
              <div className="flex gap-2 col-span-full mt-2">
                <button onClick={handleThemKhach} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">Lưu</button>
                <button onClick={() => setShowThemKhach(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded font-semibold">Hủy</button>
              </div>
            </div>
          )}
        </section>
      )}
      {/* Bước 3: Xác nhận đặt sân */}
      {sanChon && khachChon && (
        <section className="mb-6 border-b pb-6">
          <h2 className="text-lg font-semibold mb-3">Bước 3: Xác nhận đặt sân</h2>
          <div className="flex flex-col gap-2 mb-3">
            <span>Giá thuê 1 buổi: <b>{giaThue?.toLocaleString()}đ</b></span>
            <span>Số buổi: <b>{soBuoi ?? tinhSoBuoi(ngayBatDau, ngayKetThuc)}</b></span>
            {typeof tongTien === "number" && typeof tienCoc === "number" && (
              <span>Tổng tiền: <b>{tongTien.toLocaleString()}đ</b> | Đặt cọc: <b>{tienCoc.toLocaleString()}đ</b></span>
            )}
          </div>
          <button onClick={handleDatSan} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold shadow">Xác nhận đặt sân</button>
        </section>
      )}
      {/* Kết quả */}
      {ketQua && <div className="p-4 bg-green-100 text-green-700 rounded text-center font-semibold mt-4">{ketQua}</div>}
    </div>
  );
}
