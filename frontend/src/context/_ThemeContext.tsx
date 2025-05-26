'use client';
import { createContext, useEffect, useState } from 'react';

// Tạo context cho theme (chế độ sáng/tối)
export const ThemeContext = createContext({ toggle: () => {}, dark: false });

// Provider cho theme, bọc toàn bộ ứng dụng
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  // Khi component mount, kiểm tra hệ điều hành đang dùng dark mode không
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  // Hàm chuyển đổi giữa dark/light mode
  const toggle = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  // Truyền giá trị dark và hàm toggle xuống các component con
  return <ThemeContext.Provider value={{ toggle, dark }}>{children}</ThemeContext.Provider>;
}
