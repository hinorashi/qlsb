import axios from 'axios';
import { RevenueEntry, InvoiceDetail } from '@/types/types';

const BASE_URL = 'http://localhost:3000/api/thong-ke';

export async function fetchRevenue(chuki: string, nam: string): Promise<RevenueEntry[]> {
  const res = await axios.get(`${BASE_URL}?chuki=${chuki}&nam=${nam}`);
  return res.data;
}

export async function fetchInvoiceDetails(chuki: string, thoigian: string): Promise<InvoiceDetail[]> {
  const res = await axios.get(`${BASE_URL}/chi-tiet?chuki=${chuki}&thoigian=${thoigian}`);
  return res.data;
}
