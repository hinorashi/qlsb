'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DoanhThu } from '@/types/types';

interface Props {
  data: DoanhThu[];
}

// Biểu đồ cột thể hiện doanh thu theo kỳ thống kê
export default function BieuDoDoanhThu({ data }: Props) {
  return (
    <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      {/* <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300 flex items-center gap-2">
        Biểu đồ doanh thu
      </h2> */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} barSize={80}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="ky_thong_ke"
            tick={{ fontSize: 14, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 14, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              color: '#0f172a',
            }}
            labelStyle={{ color: '#3b82f6', fontWeight: 600 }}
            formatter={(value: number) => value.toLocaleString() + ' VNĐ'}
          />
          <Legend wrapperStyle={{ fontSize: 14 }} />
          <Bar
            dataKey="tong_doanh_thu"
            name="Tổng doanh thu"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
