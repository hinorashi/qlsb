'use client';
import React from 'react';
import { RevenueEntry } from '@/types/types';
import clsx from 'classnames';

interface Props {
  data: RevenueEntry[];
  onSelect: (val: string) => void;
  selected: string | null;
}

const RevenueTable: React.FC<Props> = ({ data, onSelect, selected }) => {
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
          {data.map((entry) => (
            <tr
              key={entry.ky_thong_ke}
              className={clsx(
                'hover:bg-blue-50 cursor-pointer',
                selected === entry.ky_thong_ke && 'bg-blue-100 font-semibold'
              )}
              onClick={() => onSelect(entry.ky_thong_ke)}
            >
              <td className="p-2">{entry.ky_thong_ke}</td>
              <td className="p-2 text-right">{entry.tong_doanh_thu.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RevenueTable;
