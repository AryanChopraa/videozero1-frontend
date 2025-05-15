"use client";

import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import AddChannelModal from './AddChannelModal';
import { useFilterStore } from '../lib/store';
import ChannelSelector from './ChannelSelector';
import DateRangeSelector from './DateRangeSelector';
import StatTypeSelector from './StatTypeSelector';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchChannels } = useFilterStore();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Refresh channels when modal closes (in case new channel was added)
    fetchChannels();
  };

  return (
    <>
      <div className="bg-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">summarized video statistics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ChannelSelector />
          <DateRangeSelector />
          <StatTypeSelector />
          
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