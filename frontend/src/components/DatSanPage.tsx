"use client";
import React, { useState } from 'react';
import axios from 'axios';
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
  const [khungGio, setKhungGio] = useState('18:00-20:00');
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

  // Tìm sân trống
  const handleTimSan = async () => {
    setSanChon(null);
    setSanTrong([]);
    if (!loaiSan || !khungGio || !ngayBatDau || !ngayKetThuc) return;
    const data = await fetchSanTrong({
      loai_san: loaiSan,
      khung_gio: khungGio,
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
  };

  // Khi chọn sân, tự động lấy giá thuê
  React.useEffect(() => {
    if (sanChon) {
      setGiaThue(sanChon.gia_thue_mot_buoi);
    } else {
      setGiaThue(null);
    }
  }, [sanChon]);

  // Tính tổng tiền
  const handleTinhTien = async () => {
    if (!ngayBatDau || !ngayKetThuc || !sanChon || typeof giaThue !== "number") return;
    const res = await createChiTietDatSan({
      phieu_dat_san_id: -1, // tạm thời, sẽ cập nhật sau
      san_bong_id: sanChon.id,
      khung_gio: khungGio,
      ngay_bat_dau: ngayBatDau,
      ngay_ket_thuc: ngayKetThuc,
      gia_thue_mot_buoi: giaThue,
    });
    setChiTietId(res.id);
    const res2 = await tinhTienChiTietDatSan(res.id);
    setTongTien(res2.tong_tien);
    setTienCoc(Math.round(res2.tong_tien * 0.1));
  };

  // Lưu phiếu đặt sân
  const handleDatSan = async () => {
    if (!khachChon || !sanChon || typeof tongTien !== "number" || typeof tienCoc !== "number") return;
    const res = await createPhieuDatSan({
      khach_hang_id: khachChon.id,
      tong_tien_du_kien: tongTien,
      tien_dat_coc: tienCoc,
    });
    setPhieuId(res.id);
    await createChiTietDatSan({
      phieu_dat_san_id: res.id,
      san_bong_id: sanChon.id,
      khung_gio: khungGio,
      ngay_bat_dau: ngayBatDau,
      ngay_ket_thuc: ngayKetThuc,
      gia_thue_mot_buoi: typeof giaThue === "number" ? giaThue : 0,
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

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Đặt sân bóng</h2>
      {/* Bước 1: Tìm sân trống */}
      <div className="mb-4 border-b pb-4">
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <select value={loaiSan} onChange={e => setLoaiSan(e.target.value)} className="border rounded px-2 py-1">
            <option value="7">Sân 7</option>
            <option value="11">Sân 11</option>
          </select>
          <input type="text" value={khungGio} onChange={e => setKhungGio(e.target.value)} placeholder="Khung giờ (vd: 18:00-20:00)" className="border rounded px-2 py-1" />
          <input type="date" value={ngayBatDau} onChange={e => setNgayBatDau(e.target.value)} className="border rounded px-2 py-1" />
          <input type="date" value={ngayKetThuc} onChange={e => setNgayKetThuc(e.target.value)} className="border rounded px-2 py-1" />
          <button onClick={handleTimSan} className="bg-blue-500 text-white px-3 py-1 rounded whitespace-nowrap">Tìm sân</button>
        </div>
        {sanTrong.length > 0 && (
          <div className="mt-2">
            <div className="font-semibold mb-1">Chọn sân:</div>
            <ul className="flex gap-2">
              {sanTrong.map(san => (
                <li key={san.id}>
                  <button onClick={() => setSanChon(san)} className={`px-3 py-1 rounded border ${sanChon?.id === san.id ? 'bg-green-500 text-white' : ''}`}>{san.ten_san}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Bước 2: Tìm/chọn khách hàng */}
      {sanChon && (
        <div className="mb-4 border-b pb-4">
          <div className="flex gap-2 mb-2">
            <input type="text" value={tenKhach} onChange={e => setTenKhach(e.target.value)} placeholder="Tên khách hàng" className="border rounded px-2 py-1" />
            <button onClick={handleTimKhach} className="bg-blue-500 text-white px-3 py-1 rounded">Tìm khách</button>
            <button onClick={() => setShowThemKhach(true)} className="bg-gray-500 text-white px-3 py-1 rounded">Thêm mới</button>
          </div>
          {dsKhach.length > 0 && (
            <ul className="flex flex-col gap-2">
              {dsKhach.map(kh => (
                <li key={kh.id}>
                  <button onClick={() => setKhachChon(kh)} className={`px-3 py-1 rounded border w-full text-left ${khachChon?.id === kh.id ? 'bg-green-500 text-white' : ''}`}>
                    {kh.ho_ten} ({kh.sdt})
                  </button>
                </li>
              ))}
            </ul>
          )}
          {showThemKhach && (
            <div className="mt-2 flex gap-2">
              <input type="text" placeholder="Họ tên" value={newKhach.ho_ten} onChange={e => setNewKhach(k => ({ ...k, ho_ten: e.target.value }))} className="border rounded px-2 py-1" />
              <input type="text" placeholder="SĐT" value={newKhach.sdt} onChange={e => setNewKhach(k => ({ ...k, sdt: e.target.value }))} className="border rounded px-2 py-1" />
              <input type="email" placeholder="Email" value={newKhach.email} onChange={e => setNewKhach(k => ({ ...k, email: e.target.value }))} className="border rounded px-2 py-1" />
              <button onClick={handleThemKhach} className="bg-green-500 text-white px-3 py-1 rounded">Lưu</button>
              <button onClick={() => setShowThemKhach(false)} className="bg-gray-300 px-3 py-1 rounded">Hủy</button>
            </div>
          )}
        </div>
      )}
      {/* Bước 3: Nhập giá thuê, xác nhận đặt sân */}
      {sanChon && khachChon && (
        <div className="mb-4 border-b pb-4">
          <div className="flex gap-2 mb-2 items-center">
            <span>Giá thuê 1 buổi: <b>{giaThue?.toLocaleString()}đ</b></span>
            <button onClick={handleTinhTien} className="bg-blue-500 text-white px-3 py-1 rounded">Tính tiền</button>
            {typeof tongTien === "number" && typeof tienCoc === "number" && (
              <span className="ml-2">Tổng tiền: <b>{tongTien.toLocaleString()}đ</b> | Đặt cọc: <b>{tienCoc.toLocaleString()}đ</b></span>
            )}
          </div>
          <button onClick={handleDatSan} className="bg-green-600 text-white px-4 py-2 rounded">Xác nhận đặt sân</button>
        </div>
      )}
      {/* Kết quả */}
      {ketQua && <div className="p-3 bg-green-100 text-green-700 rounded">{ketQua}</div>}
    </div>
  );
}
