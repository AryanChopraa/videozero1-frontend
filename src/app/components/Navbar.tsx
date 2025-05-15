"use client";

import { usePathname } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  
  // Determine the title based on the current path
  const getTitle = () => {
    switch(pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/settings':
        return 'Settings';
      case '/videos':
        return 'Videos';
      default:
        return 'Intelligence';
    }
  }
  
  return (
    <div className="w-full h-14 bg-black flex justify-between items-center px-6">
      {/* Left - Logo */}
      <div className="flex items-center">
        <Image src="/icons/Logo.svg" alt="Logo" width={24} height={24} />
      </div>
      
      {/* Middle - Page Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <span className="text-white font-medium">zero1{getTitle().toLowerCase()}</span>
      </div>
      
      {/* Right - Company Name and Logout */}
      <div className="flex items-center space-x-3">
        <span className="text-white">zerodha</span>
        <FiLogOut className="text-white" />
      </div>
    </div>
  );
}
