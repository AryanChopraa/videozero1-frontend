"use client";

import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import AddChannelModal from './AddChannelModal';
import { useFilterStore } from '../lib/store';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use global filter store for everything
  const { 
    selectedChannel, 
    dateRange, 
    statType,
    channels,
    isLoading,
    fetchChannels, 
    setSelectedChannel, 
    setDateRange, 
    setStatType 
  } = useFilterStore();

  useEffect(() => {
    // Fetch channels only once on component mount
    // or when modal closes (in case a new channel was added)
    fetchChannels();
  }, [fetchChannels, isModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last90days', label: 'Last 90 days' },
    { value: 'lastYear', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];
  
  const statTypeOptions = [
    { value: 'total', label: 'Total stats' },
    { value: 'average', label: 'Average stats' },
    { value: 'growth', label: 'Growth rate' }
  ];

  return (
    <>
      <div className="bg-white p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">summarized video statistics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
            >
              <option value="all">All channels</option>
              {channels.length > 0 ? (
                channels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.title}
                  </option>
                ))
              ) : !isLoading ? (
                <option value="" disabled>No channels available</option>
              ) : null}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm"
              value={statType}
              onChange={(e) => setStatType(e.target.value)}
            >
              {statTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <button 
            onClick={openModal}
            className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-md"
          >
            <FiPlus className="h-4 w-4" />
            <span className="text-sm">Add new channel</span>
          </button>
        </div>
      </div>

      <AddChannelModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
} 