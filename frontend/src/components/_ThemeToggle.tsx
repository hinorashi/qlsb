'use client';
import { useContext } from 'react';
import { ThemeContext } from '@/context/_ThemeContext';

export default function ThemeToggle() {
  const { toggle, dark } = useContext(ThemeContext);

  return (
    <button
      onClick={toggle}
      className="p-2 border rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
