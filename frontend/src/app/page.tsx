// Trang thống kê doanh thu
'use client';
import { useState, useEffect } from 'react';
import { fetchRevenue, fetchInvoiceDetails } from '@/lib/api';
import { DoanhThu, HoaDon } from '@/types/types';
import FilterBar from '@/components/FilterBar';
import BangDoanhThu from '@/components/BangDoanhThu';
import ChiTietHoaDon from '@/components/ChiTietHoaDon';

export default function HomePage() {
  // State cho chu kỳ, năm, dữ liệu doanh thu, mục đã chọn và chi tiết hóa đơn
  const [chuki, setChuki] = useState('thang');
  const [nam, setNam] = useState('2025');
  const [revenues, setRevenues] = useState<DoanhThu[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<HoaDon[]>([]);

  // Khi thay đổi chu kỳ hoặc năm, fetch lại dữ liệu doanh thu
  useEffect(() => {
    fetchRevenue(chuki, nam).then(setRevenues);
    setSelected(null);
    setInvoices([]);
  }, [chuki, nam]);

  // Khi chọn một kỳ thống kê, fetch chi tiết hóa đơn tương ứng
  useEffect(() => {
    if (selected) {
      fetchInvoiceDetails(chuki, selected).then(setInvoices);
    }
  }, [selected]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Thống kê doanh thu</h1>
      {/* Thanh điều khiển chọn chu kỳ và năm */}
      <FilterBar chuki={chuki} setChuki={setChuki} nam={nam} setNam={setNam} />
      {/* Bảng doanh thu tổng hợp */}
      <BangDoanhThu data={revenues} onSelect={setSelected} selected={selected} />
      {/* Hiển thị chi tiết hóa đơn nếu đã chọn */}
      {selected && <ChiTietHoaDon invoices={invoices} />}
    </main>
  );
}
