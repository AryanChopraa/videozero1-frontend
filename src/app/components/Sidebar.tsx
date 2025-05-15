"use client";

import { FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col justify-between py-4 h-screen">
      <div className="space-y-6 flex flex-col items-center">
        <Link href="/dashboard">
          <div className={`p-2 rounded-lg ${pathname === '/dashboard' ? 'bg-gray-100' : 'hover:bg-gray-100'} cursor-pointer`}>
            <Image src="/icons/intelligence.svg" alt="Dashboard" width={24} height={24} />
          </div>
        </Link>
        <Link href="/settings">
          <div className={`p-2 rounded-lg ${pathname === '/settings' ? 'bg-gray-100' : 'hover:bg-gray-100'} cursor-pointer`}>
            <Image src="/icons/comments.svg" alt="Settings" width={24} height={24} />
          </div>
        </Link>
        <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <Image src="/icons/generate.svg" alt="Analytics" width={24} height={24} />
        </div>
      </div>
      
      {/* <div className="flex justify-center">
        <div className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-red-500">
          <FiLogOut className="h-6 w-6" />
        </div>
      </div> */}
    </div>
  );
} 