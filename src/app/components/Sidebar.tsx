"use client";

import { FiSettings, FiHome, FiBarChart2 } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-8">
      <Link href="/settings">
        <div className={`p-2 rounded-lg ${pathname === '/settings' ? 'bg-gray-100' : 'hover:bg-gray-100'} cursor-pointer`}>
          <FiSettings className="h-6 w-6 text-gray-700" />
        </div>
      </Link>
      <Link href="/dashboard">
        <div className={`p-2 rounded-lg ${pathname === '/dashboard' ? 'bg-gray-100' : 'hover:bg-gray-100'} cursor-pointer`}>
          <FiHome className="h-6 w-6 text-gray-700" />
        </div>
      </Link>
      <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <FiBarChart2 className="h-6 w-6 text-gray-700" />
      </div>
    </div>
  );
} 