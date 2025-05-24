'use client';
import React from 'react';
import { DoanhThu } from '@/types/types';
import clsx from 'classnames';

interface Props {
  data: DoanhThu[];
  onSelect: (val: string) => void;
  selected: string | null;
}

// Bảng hiển thị doanh thu tổng hợp theo kỳ thống kê
const BangDoanhThu: React.FC<Props> = ({ data, onSelect, selected }) => {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full table-auto text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2">Kỳ thống kê</th>
            <th className="p-2 text-right">Tổng doanh thu (VNĐ)</th>
          </tr>
        </thead>
        <tbody>
          {/* Duyệt qua từng dòng dữ liệu doanh thu */}
          {data.map((entry) => (
            <tr
              key={entry.ky_thong_ke}
              className={clsx(
                'hover:bg-blue-50 cursor-pointer',
                selected === entry.ky_thong_ke && 'bg-blue-100 font-semibold'
              )}
              // Khi click vào dòng sẽ chọn kỳ thống kê tương ứng
              onClick={() => onSelect(entry.ky_thong_ke)}
            >
              <td className="p-2">{entry.ky_thong_ke}</td>
              {/* Hiển thị doanh thu, format số có dấu phẩy */}
              <td className="p-2 text-right">{entry.tong_doanh_thu.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BangDoanhThu;
