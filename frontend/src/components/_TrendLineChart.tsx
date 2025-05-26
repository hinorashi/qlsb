'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DoanhThu } from '@/types/types';

// Biểu đồ đường thể hiện xu hướng doanh thu theo thời gian
export default function TrendLineChart({ data }: { data: DoanhThu[] }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Xu hướng doanh thu</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          {/* Lưới nền cho biểu đồ */}
          <CartesianGrid strokeDasharray="3 3" />
          {/* Trục hoành hiển thị kỳ thống kê (tháng/quý/năm) */}
          <XAxis dataKey="ky_thong_ke" />
          {/* Trục tung hiển thị giá trị doanh thu */}
          <YAxis />
          {/* Tooltip hiển thị chi tiết khi hover */}
          <Tooltip />
          {/* Đường biểu diễn doanh thu theo thời gian */}
          <Line type="monotone" dataKey="tong_doanh_thu" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
