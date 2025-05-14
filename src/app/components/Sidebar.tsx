"use client";

import { FiSettings, FiHome, FiBarChart2 } from 'react-icons/fi';

export default function Sidebar() {
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-8">
      <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <FiSettings className="h-6 w-6 text-gray-700" />
      </div>
      <div className="p-2 rounded-lg bg-gray-100 cursor-pointer">
        <FiHome className="h-6 w-6 text-gray-700" />
      </div>
      <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <FiBarChart2 className="h-6 w-6 text-gray-700" />
      </div>
    </div>
  );
} 