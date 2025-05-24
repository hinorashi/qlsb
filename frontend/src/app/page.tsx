'use client';
import { useState, useEffect } from 'react';
import { fetchRevenue, fetchInvoiceDetails } from '@/lib/api';
import { RevenueEntry, InvoiceDetail } from '@/types/types';
import FilterBar from '@/components/FilterBar';
import RevenueTable from '@/components/RevenueTable';
import InvoiceDetails from '@/components/InvoiceDetails';

export default function HomePage() {
  const [chuki, setChuki] = useState('thang');
  const [nam, setNam] = useState('2025');
  const [revenues, setRevenues] = useState<RevenueEntry[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<InvoiceDetail[]>([]);

  useEffect(() => {
    fetchRevenue(chuki, nam).then(setRevenues);
    setSelected(null);
    setInvoices([]);
  }, [chuki, nam]);

  useEffect(() => {
    if (selected) {
      fetchInvoiceDetails(chuki, selected).then(setInvoices);
    }
  }, [selected]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Thống kê doanh thu</h1>
      <FilterBar chuki={chuki} setChuki={setChuki} nam={nam} setNam={setNam} />
      <RevenueTable data={revenues} onSelect={setSelected} selected={selected} />
      {selected && <InvoiceDetails invoices={invoices} />}
    </main>
  );
}
