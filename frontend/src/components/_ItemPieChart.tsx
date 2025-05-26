'use client';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

// Màu sắc cho từng phần của biểu đồ
const COLORS = ['#3b82f6', '#22c55e', '#f59e0b'];

// Biểu đồ tròn thể hiện doanh thu theo mặt hàng
export default function ItemPieChart({ data }: { data: { ten: string; tong_doanh_thu: number }[] }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Doanh thu theo mặt hàng</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          {/* Vẽ biểu đồ tròn với dữ liệu truyền vào */}
          <Pie
            data={data}
            dataKey="tong_doanh_thu"
            nameKey="ten"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {/* Gán màu cho từng phần của biểu đồ */}
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          {/* Tooltip hiển thị khi hover */}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
