"use client";

import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiCalendar, FiChevronDown } from 'react-icons/fi';
import AddChannelModal from './AddChannelModal';
import { useFilterStore } from '../lib/store';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  
  // Use global filter store for everything
  const { 
    selectedChannel, 
    dateRange, 
    statType,
    customStartDate,
    customEndDate,
    channels,
    isLoading,
    fetchChannels, 
    setSelectedChannel, 
    setDateRange, 
    setStatType,
    setCustomDateRange 
  } = useFilterStore();

  useEffect(() => {
    // Fetch channels only once on component mount
    // or when modal closes (in case a new channel was added)
    fetchChannels();
  }, [fetchChannels, isModalOpen]);

  useEffect(() => {
    // Set local state from store when custom dates exist
    if (customStartDate && customEndDate && dateRange === 'custom') {
      setStartDate(customStartDate);
      setEndDate(customEndDate);
    }
  }, [customStartDate, customEndDate, dateRange]);

  useEffect(() => {
    // Close date dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const dateRangeOptions = [
    { value: 'allTime', label: 'All time' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last60days', label: 'Last 60 days' },
    { value: 'last90days', label: 'Last 90 days' },
    { value: 'lastYear', label: 'Last year' },
    // { value: 'custom', label: 'Custom range' }
  ];

  const statTypeOptions = [
    { value: 'total', label: 'Total stats' },
    { value: 'average', label: 'Average stats' },
    { value: 'growth', label: 'Growth rate' }
  ];

  const handleDateRangeSelect = (value: string) => {
    if (value !== 'custom') {
      setDateRange(value);
      setIsDateDropdownOpen(false);
    }
  };
  
  const applyCustomDateRange = () => {
    if (startDate && endDate) {
      setDateRange('custom');
      setCustomDateRange(startDate, endDate);
      setIsDateDropdownOpen(false);
    }
  };

  // Get the current display label for the date dropdown
  const getCurrentDateRangeLabel = () => {
    if (dateRange === 'custom' && startDate && endDate) {
      try {
        // Format dates like "Jan 1, 2023 - May 2, 2025"
        const start = new Date(startDate);
        const end = new Date(endDate);
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      } catch (e) {
        return 'Custom range';
      }
    }
    return dateRangeOptions.find(option => option.value === dateRange)?.label || 'Select date range';
  };

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
          
          {/* Date Range Dropdown */}
          <div className="relative" ref={dateDropdownRef}>
            <div 
              className="flex items-center justify-between bg-white border border-gray-300 rounded-md py-2 px-3 w-64 cursor-pointer"
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            >
              {dateRange === 'custom' && startDate && endDate ? (
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-gray-500" />
                  <span className="text-sm">{getCurrentDateRangeLabel()}</span>
                </div>
              ) : (
                <span className="text-sm">{getCurrentDateRangeLabel()}</span>
              )}
              <FiChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            
            {isDateDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 py-2 z-10 w-96">
                <div className="px-4 py-2 border-b border-gray-200">
                  {dateRangeOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`px-3 py-2 text-sm rounded-md cursor-pointer my-1 ${dateRange === option.value ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={() => handleDateRangeSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <div className="mb-2 text-xs font-medium text-gray-500">Custom date range</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[150px]">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="flex-1 min-w-[150px]">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
                        placeholder="dd/mm/yyyy"
                      />
                    </div>
                    <button
                      onClick={applyCustomDateRange}
                      className="bg-black text-white px-6 py-2 rounded-md text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
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