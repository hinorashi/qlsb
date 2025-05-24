'use client';
import React from 'react';

interface Props {
  chuki: string;
  setChuki: (val: string) => void;
  nam: string;
  setNam: (val: string) => void;
}

const FilterBar: React.FC<Props> = ({ chuki, setChuki, nam, setNam }) => {
  return (
    <div className="flex items-center gap-4 mb-4">
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
