"use client";
import { useState, useEffect } from "react";
import { fetchSanBong, createSanBong, updateSanBong, deleteSanBong } from "@/lib/api";
import { SanBong } from "@/types/types";

export default function SanBongPage() {
  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState<SanBong[]>([]);
  const [editing, setEditing] = useState<SanBong | null>(null);
  const [form, setForm] = useState<Omit<SanBong, "id">>({ ten_san: "", loai_san: "", mo_ta: "", gia_thue_theo_gio: 0 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Tìm kiếm sân bóng
  const handleSearch = async () => {
    setError("");
    // Nếu không nhập tukhoa, trả về toàn bộ danh sách
    if (!keyword.trim()) {
      const data = await fetchSanBong();
      setList(data);
      setEditing(null);
      setMessage("");
      return;
    }
    const data = await fetchSanBong(keyword);
    setList(data);
    setEditing(null);
    if (data.length === 0) {
      setError("Không tìm thấy sân bóng phù hợp.");
      setMessage("");
    } else {
      setMessage("");
      setError("");
    }
  };

  // Chọn sửa sân bóng
  const handleEdit = (sb: SanBong) => {
    setEditing(sb);
    setForm({ ten_san: sb.ten_san, loai_san: sb.loai_san, mo_ta: sb.mo_ta || "", gia_thue_theo_gio: typeof sb.gia_thue_theo_gio === 'number' ? sb.gia_thue_theo_gio : 0 });
    setMessage("");
  };

  // Xử lý form thêm/sửa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateSanBong(editing.id, form);
      setMessage("Cập nhật thành công!");
      setEditing(null);
      handleSearch();
    } else {
      await createSanBong(form);
      setMessage("Thêm mới thành công!");
      setForm({ ten_san: "", loai_san: "", mo_ta: "", gia_thue_theo_gio: 0 });
      handleSearch();
    }
  };

  // Xóa sân bóng
  const handleDelete = async (id: number) => {
    if (confirm("Bạn chắc chắn muốn xóa?")) {
      await deleteSanBong(id);
      setMessage("Đã xóa sân bóng.");
      handleSearch();
    }
  };

  // Tải danh sách sân bóng khi vào trang lần đầu
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-1 text-center">Quản lý thông tin sân bóng</h1>
      <p className="text-gray-500 dark:text-gray-300 text-center mb-6">Thêm mới, chỉnh sửa, tìm kiếm và quản lý danh sách sân bóng mini.</p>
      {/* Tìm kiếm sân bóng */}
      <section className="mb-6 border-b pb-6">
        <h2 className="text-lg font-semibold mb-3">Tìm kiếm sân bóng</h2>
        <form
          onSubmit={e => { e.preventDefault(); handleSearch(); }}
          className="flex gap-3 mb-3"
        >
          <input
            className="border px-2 py-1 rounded flex-1 min-w-[220px]"
            placeholder="Nhập tên sân bóng để tìm kiếm..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow">Tìm kiếm</button>
        </form>
        {message && <div className="mb-2 text-green-600 font-semibold">{message}</div>}
        {error && <div className="mb-2 text-red-600 font-semibold">{error}</div>}
      </section>
      {/* Thêm mới / Sửa sân bóng */}
      <section className="mb-6 border-b pb-6">
        <h2 className="text-lg font-semibold mb-3">{editing ? "Sửa thông tin sân bóng" : "Thêm mới sân bóng"}</h2>
        <form onSubmit={handleSubmit} className="space-y-2 bg-gray-50 p-4 rounded shadow">
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Tên sân bóng"
            value={form.ten_san}
            onChange={e => setForm(f => ({ ...f, ten_san: e.target.value }))}
            required
          />
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Loại sân (7, 11)"
            value={form.loai_san}
            onChange={e => setForm(f => ({ ...f, loai_san: e.target.value }))}
            required
          />
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Mô tả"
            value={form.mo_ta}
            onChange={e => setForm(f => ({ ...f, mo_ta: e.target.value }))}
          />
          <input
            className="border px-2 py-1 rounded w-full"
            placeholder="Giá thuê một buổi (VNĐ)"
            type="number"
            min={0}
            value={form.gia_thue_theo_gio ?? 0}
            onChange={e => setForm(f => ({ ...f, gia_thue_theo_gio: Number(e.target.value) }))}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">{editing ? "Cập nhật" : "Thêm mới"}</button>
            {editing && (
              <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold" onClick={() => { setEditing(null); setForm({ ten_san: "", loai_san: "", mo_ta: "", gia_thue_theo_gio: 0 }); }}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </section>
      {/* Danh sách sân bóng */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Danh sách sân bóng hiện có</h2>
        <table className="w-full table-auto border rounded shadow mb-3">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Tên sân</th>
              <th className="p-2">Loại sân</th>
              <th className="p-2">Mô tả</th>
              <th className="p-2">Giá thuê theo giờ</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {list.map(sb => (
              <tr key={sb.id} className="border-t">
                <td className="p-2">{sb.id}</td>
                <td className="p-2">{sb.ten_san}</td>
                <td className="p-2">{sb.loai_san}</td>
                <td className="p-2">{sb.mo_ta}</td>
                <td className="p-2">{typeof sb.gia_thue_theo_gio === 'number' ? sb.gia_thue_theo_gio.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ''}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded text-white font-semibold" onClick={() => handleEdit(sb)}>Sửa</button>
                  <button className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white font-semibold" onClick={() => handleDelete(sb.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
