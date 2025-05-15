import { useState, useRef, useEffect } from 'react';
import { useFilterStore } from '../lib/store';
import { FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';
import Image from 'next/image';

interface ChannelSelectorProps {
  className?: string;
}

export default function ChannelSelector({ className = '' }: ChannelSelectorProps) {
  const { 
    selectedChannels,
    toggleChannel,
    channels,
    isLoading
  } = useFilterStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Header text based on selected channels
  const getHeaderText = () => {
    if (selectedChannels.length === 0) return 'All channels';
    if (selectedChannels.length === channels.length) return 'All channels';
    if (selectedChannels.length === 1) {
      const selectedChannel = channels.find(c => c.id === selectedChannels[0]);
      return selectedChannel?.title || 'Selected channel';
    }
    return `${selectedChannels.length} channels`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown header */}
      <div 
        className="flex items-center justify-between bg-gray-100 rounded-md py-2 px-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-800 text-xs items-center flex">{getHeaderText()}</span>
        {isOpen ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="fixed z-50 mt-1 w-64 bg-gray-50 rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto" style={{ top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + window.scrollY : 0, left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left + window.scrollX : 0 }}>
          {channels.length > 0 ? (
            channels.map((channel) => (
              <div 
                key={channel.id} 
                className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleChannel(channel.id)}
              >
                <div className="flex items-center space-x-3 justify-center">
                  {/* Channel logo */}
                  <div className="w-8 h-8 flex-shrink-0 overflow-hidden rounded">
                    {channel.thumbnail_url ? (
                      <Image 
                        src={channel.thumbnail_url} 
                        alt={channel.title} 
                        width={30} 
                        height={30}
                        className="object-cover rounded-md border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 flex items-center justify-center">
                        {channel.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium">{channel.title}</span>
                </div>
                {/* Checkbox */}
                <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-md border ${
                  selectedChannels.includes(channel.id) 
                    ? 'bg-white border-gray-300' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {selectedChannels.includes(channel.id) && <FiCheck className="text-black w-4 h-4" />}
                </div>
              </div>
            ))
          ) : !isLoading ? (
            <div className="p-3 text-center text-gray-500 text-xs">No channels available</div>
          ) : (
            <div className="p-3 text-center text-gray-500 text-xs">Loading channels...</div>
          )}
        </div>
      )}
    </div>
  );
} 