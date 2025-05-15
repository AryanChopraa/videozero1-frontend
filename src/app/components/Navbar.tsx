"use client";

import { usePathname } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import Image from 'next/image';
import { useState } from 'react';
import { useAuthStore } from '../lib/store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
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

  const handleLogout = () => {
    logout();
    router.push('/login');
    setShowLogoutDialog(false); // Close dialog after logout
  };

  const openLogoutDialog = () => {
    setShowLogoutDialog(true);
  };

  const closeLogoutDialog = () => {
    setShowLogoutDialog(false);
  };
  
  return (
    <>
      <div className="w-full h-14 bg-black flex justify-between items-center px-6">
        {/* Left - Logo */}
        <div className="flex items-center">
          <Image src="/icons/Logo.svg" alt="Logo" width={24} height={24} />
        </div>
        
        {/* Middle - Page Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-white font-bold text-sm">{getTitle().toLowerCase()}</span>
        </div>
        
        {/* Right - Company Name and Logout */}
        <div className="flex items-center space-x-3">
          <span className="text-white text-sm font-semibold">zerodha</span>
          <FiLogOut className="text-white cursor-pointer" onClick={openLogoutDialog} />
        </div>
      </div>

      {showLogoutDialog && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <p className="text-gray-800 font-semibold text-lg text-left mr-4">Are you sure you want <br/> to logout of ZeroIntelligence?</p>
              <button onClick={closeLogoutDialog} className="text-gray-500 hover:text-gray-700 p-1 border border-gray-300 rounded-md flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={closeLogoutDialog}
                className="px-4 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-3 text-base font-medium text-white bg-neutral-800 rounded-md hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
