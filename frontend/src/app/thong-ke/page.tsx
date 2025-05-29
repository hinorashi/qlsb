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
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thống kê doanh thu</h1>
      <FilterBar chuki={chuki} setChuki={setChuki} nam={nam} setNam={setNam} />
      {/* Biểu đồ doanh thu */}
      <BieuDoDoanhThu data={revenues} />
      {/* <TrendLineChart data={revenues} /> */}
      {/* Bảng doanh thu tổng hợp */}
      <BangDoanhThu data={revenues} onSelect={setSelected} selected={selected} />
      {/* Hiển thị chi tiết hóa đơn nếu đã chọn */}
      {selected && <ChiTietHoaDon invoices={invoices} />}
    </main>
  );
}
