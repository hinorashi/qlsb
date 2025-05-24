'use client';
import React from 'react';

interface Props {
  chuki: string;
  setChuki: (val: string) => void;
  nam: string;
  setNam: (val: string) => void;
}

// Thanh điều khiển chọn loại thống kê (chu kỳ) và năm
const FilterBar: React.FC<Props> = ({ chuki, setChuki, nam, setNam }) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      {/* Chọn loại thống kê: tháng, quý, năm */}
      <label className="font-medium">Loại thống kê:</label>
      <select
        value={chuki}
        onChange={(e) => setChuki(e.target.value)}
        className="border px-2 py-1 rounded-md"
      >
        <option value="thang">Theo tháng</option>
        <option value="quy">Theo quý</option>
        <option value="nam">Theo năm</option>
      </select>

      {/* Nhập năm cần thống kê */}
      <label className="font-medium">Năm:</label>
      <input
        type="number"
        value={nam}
        onChange={(e) => setNam(e.target.value)}
        className="border px-2 py-1 w-24 rounded-md"
      />
    </div>
  );
};

export default FilterBar;
