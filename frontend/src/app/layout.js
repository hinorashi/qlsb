import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quản lí Sân bóng",
  description: "Phần mềm quản lí sân bóng",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 min-h-screen`}
      >
        <header className="w-full max-w-4xl mx-auto px-4 py-2 items-center flex flex-col">
          <nav className="flex gap-4 mb-4">
            <Link href="/" className="text-blue-700 font-semibold hover:underline">
              Trang chủ
            </Link>
            <Link href="/san-bong" className="text-blue-700 hover:underline">
              Quản lý sân bóng
            </Link>
            <Link href="/dat-san" className="text-blue-700 hover:underline">
              Đặt sân
            </Link>
            <Link href="/checkout" className="text-blue-700 hover:underline">
              Checkout
            </Link>
            <Link href="/thanh-toan" className="text-blue-700 hover:underline">
              Thanh toán
            </Link>
            <Link href="/thong-ke" className="text-blue-700 hover:underline">
              Thống kê doanh thu
            </Link>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto px-4 pb-8 gap-8 items-center flex flex-col min-h-screen">
          {children}
        </main>
        <footer className="p-4 text-sm text-center text-gray-400">
          © 2025 Nguyễn Nhật Quang
        </footer>
      </body>
    </html>
  );
}
