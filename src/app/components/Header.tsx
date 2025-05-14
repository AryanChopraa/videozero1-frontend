"use client";

import { FiPlus } from 'react-icons/fi';

export default function Header() {
  return (
    <div className="bg-white p-6 border-b border-gray-200 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">summarized video statistics</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm">
            <option>All channels</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm">
            <option>Jan 1, 2023 - May 2, 2025</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm">
            <option>Total stats</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-md">
          <FiPlus className="h-4 w-4" />
          <span className="text-sm">Add new channel</span>
        </button>
      </div>
    </div>
  );
} 