'use client';
import Link from 'next/link';
import { ArrowRightStartOnRectangleIcon, ChartBarIcon, CreditCardIcon, CalendarDaysIcon, HomeModernIcon } from "@heroicons/react/24/outline";

// Trang chủ
export default function HomePage() {

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-1 text-center">Hệ thống quản lý cho thuê sân bóng mini</h1>
      <p className="text-gray-500 dark:text-gray-300 text-center mb-6">Quản lý đặt sân, thanh toán, thống kê doanh thu và các chức năng quản lý khác.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        <Link href="/san-bong" className="flex flex-col items-center bg-blue-50 hover:bg-blue-100 rounded-lg p-6 shadow transition">
          <HomeModernIcon className="h-8 w-8 text-blue-600 mb-2" />
          <span className="font-semibold">Quản lý sân bóng</span>
        </Link>
        <Link href="/dat-san" className="flex flex-col items-center bg-green-50 hover:bg-green-100 rounded-lg p-6 shadow transition">
          <CalendarDaysIcon className="h-8 w-8 text-green-600 mb-2" />
          <span className="font-semibold">Đặt sân</span>
        </Link>
        <Link href="/checkout" className="flex flex-col items-center bg-yellow-50 hover:bg-yellow-100 rounded-lg p-6 shadow transition">
          <ArrowRightStartOnRectangleIcon className="h-8 w-8 text-yellow-600 mb-2" />
          <span className="font-semibold">Checkout</span>
        </Link>
        <Link href="/thanh-toan" className="flex flex-col items-center bg-purple-50 hover:bg-purple-100 rounded-lg p-6 shadow transition">
          <CreditCardIcon className="h-8 w-8 text-purple-600 mb-2" />
          <span className="font-semibold">Thanh toán</span>
        </Link>
        <Link href="/thong-ke" className="flex flex-col items-center bg-pink-50 hover:bg-pink-100 rounded-lg p-6 shadow transition col-span-full">
          <ChartBarIcon className="h-8 w-8 text-pink-600 mb-2" />
          <span className="font-semibold">Thống kê doanh thu</span>
        </Link>
      </div>
    </div>
  );
}
