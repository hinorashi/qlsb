// Trang chủ
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchRevenue, fetchInvoiceDetails } from '@/lib/api';
import { DoanhThu, HoaDon } from '@/types/types';
import FilterBar from '@/components/FilterBar';
import BangDoanhThu from '@/components/BangDoanhThu';
import ChiTietHoaDon from '@/components/ChiTietHoaDon';
import BieuDoDoanhThu from '@/components/BieuDoDoanhThu';
// import ItemPieChart from '@/components/ItemPieChart';
// import ThemeToggle from '@/components/_ThemeToggle';
// import TrendLineChart from '@/components/_TrendLineChart';

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
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">Hệ thống quản lý cho thuê sân bóng mini</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link href="/thong-ke" className="block p-4 rounded-lg shadow bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 border border-blue-200 text-lg font-semibold text-blue-700 dark:text-blue-200 text-center transition">
          📊 Thống kê doanh thu
        </Link>
        <Link href="/san-bong" className="block p-4 rounded-lg shadow bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900 border border-green-200 text-lg font-semibold text-green-700 dark:text-green-200 text-center transition">
          ⚽ Quản lý thông tin sân bóng
        </Link>
      </div>
    </main>
  );
}
