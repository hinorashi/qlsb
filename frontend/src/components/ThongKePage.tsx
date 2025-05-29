"use client";
import { useState, useEffect } from "react";
import { fetchRevenue, fetchInvoiceDetails } from "@/lib/api";
import { DoanhThu, HoaDon } from "@/types/types";
import FilterBar from "@/components/FilterBar";
import BangDoanhThu from "@/components/BangDoanhThu";
import ChiTietHoaDon from "@/components/ChiTietHoaDon";

export default function ThongKePage() {
  const [chuki, setChuki] = useState("thang");
  const [nam, setNam] = useState("2025");
  const [revenues, setRevenues] = useState<DoanhThu[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<HoaDon[]>([]);

  useEffect(() => {
    fetchRevenue(chuki, nam).then(setRevenues);
    setSelected(null);
    setInvoices([]);
  }, [chuki, nam]);

  useEffect(() => {
    if (selected) {
      fetchInvoiceDetails(chuki, selected).then(setInvoices);
    }
  }, [selected, chuki]);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Thống kê doanh thu</h1>
      <FilterBar chuki={chuki} setChuki={setChuki} nam={nam} setNam={setNam} />
      <BangDoanhThu data={revenues} onSelect={setSelected} selected={selected} />
      {selected && <ChiTietHoaDon invoices={invoices} />}
    </main>
  );
}
