'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DoanhThu } from '@/types/types';

interface Props {
  data: DoanhThu[];
}

export default function BieuDoDoanhThu({ data }: Props) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Biểu đồ doanh thu</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ky_thong_ke" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="tong_doanh_thu" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
