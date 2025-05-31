"use client";
import { useState, useEffect } from "react";
import { fetchRevenue, fetchInvoiceDetails } from "@/lib/api";
import { DoanhThu, HoaDon } from "@/types/types";
import FilterBar from "@/components/FilterBar";
import BangDoanhThu from "@/components/BangDoanhThu";
import ChiTietHoaDon from "@/components/ChiTietHoaDon";
import BieuDoDoanhThu from "@/components/BieuDoDoanhThu";

export default function ThongKePage() {
  // State cho chu kỳ, năm, dữ liệu doanh thu, mục đã chọn và chi tiết hóa đơn
  const [chuki, setChuki] = useState("thang");
  const [nam, setNam] = useState("2025");
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
  }, [selected, chuki]);

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-1 text-center">Thống kê doanh thu</h1>
      <p className="text-gray-500 dark:text-gray-300 text-center mb-6">
        Xem báo cáo doanh thu, biểu đồ, bảng tổng hợp và chi tiết hóa đơn từng kỳ.
      </p>
      <section className="mb-6 border-b pb-6">
        <h2 className="text-lg font-semibold mb-3">Bộ lọc thống kê</h2>
        <FilterBar chuki={chuki} setChuki={setChuki} nam={nam} setNam={setNam} />
      </section>
      <section className="mb-6 border-b pb-6">
        <h2 className="text-lg font-semibold mb-3">Biểu đồ doanh thu</h2>
        <BieuDoDoanhThu data={revenues} />
      </section>
      <section className="mb-6 border-b pb-6">
        <h2 className="text-lg font-semibold mb-3">Bảng doanh thu tổng hợp theo kỳ</h2>
        <BangDoanhThu data={revenues} onSelect={setSelected} selected={selected} />
      </section>
      {selected && (
        <section>
          {/* <h2 className="text-lg font-semibold mb-3">Chi tiết hóa đơn</h2> */}
          <ChiTietHoaDon invoices={invoices} />
        </section>
      )}
    </div>
  );
}
