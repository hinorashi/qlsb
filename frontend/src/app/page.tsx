// Trang chủ
'use client';
import Link from 'next/link';
// import ItemPieChart from '@/components/ItemPieChart';
// import ThemeToggle from '@/components/_ThemeToggle';
// import TrendLineChart from '@/components/_TrendLineChart';

export default function HomePage() {

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
        <Link href="/dat-san" className="block p-4 rounded-lg shadow bg-white dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-yellow-900 border border-yellow-200 text-lg font-semibold text-yellow-700 dark:text-yellow-200 text-center transition">
          📝 Đặt sân
        </Link>
        <Link href="/checkout" className="block p-4 rounded-lg shadow bg-white dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-yellow-900 border border-yellow-200 text-lg font-semibold text-yellow-700 dark:text-yellow-200 text-center transition">
          🧾 Checkout buổi thuê & mặt hàng đã dùng
        </Link>
      </div>
    </main>
  );
}
