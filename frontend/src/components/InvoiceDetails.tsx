'use client';
import React from 'react';
import { InvoiceDetail } from '@/types/types';

interface Props {
  invoices: InvoiceDetail[];
}

const InvoiceDetails: React.FC<Props> = ({ invoices }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Chi tiết hóa đơn</h2>
      <div className="overflow-x-auto border rounded-md">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Khách hàng</th>
              <th className="p-2">Sân</th>
              <th className="p-2">Ngày thanh toán</th>
              <th className="p-2 text-right">Tổng tiền (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.hoa_don_id}>
                <td className="p-2">{inv.hoa_don_id}</td>
                <td className="p-2">{inv.ten_khach}</td>
                <td className="p-2">{inv.ten_san}</td>
                <td className="p-2">{inv.ngay_thanh_toan}</td>
                <td className="p-2 text-right">{inv.tong_tien.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceDetails;
