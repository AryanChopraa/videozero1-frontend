import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiCheck, FiInfo } from 'react-icons/fi';
import { useFilterStore } from '../lib/store';

interface StatTypeSelectorProps {
  className?: string;
}

export default function StatTypeSelector({ className = '' }: StatTypeSelectorProps) {
  const { statType, setStatType, selectedChannels } = useFilterStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Component should be disabled if only one or no channels are selected
  const isDisabled = selectedChannels.length <= 1;

  const statTypeOptions = [
    { value: 'total', label: 'Total stats' },
    { value: 'average', label: 'Average stats' },
  ];

  // Get label for the currently selected option
  const getSelectedLabel = () => {
    const selectedOption = statTypeOptions.find(opt => opt.value === statType);
    return selectedOption ? selectedOption.label : statTypeOptions[0]?.label || '';
  };

  // Clean up any lingering timeouts
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

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

  const handleSelect = (optionValue: string) => {
    setStatType(optionValue);
    setIsOpen(false);
  };

  const handleToggleDropdown = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleMouseEnter = () => {
    if (isDisabled) {
      // Clear any existing timeout
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      // Set timeout to show tooltip
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    // Set timeout to hide tooltip
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 300);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown header */}
      <div
        className={`flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md py-1.5 px-3 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={handleToggleDropdown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="text-xs font-semibold">{getSelectedLabel()}</span>
        {isOpen ? <FiChevronUp className="h-3 w-3" /> : <FiChevronDown className="h-3 w-3" />}
      </div>

      {/* Tooltip */}
      {showTooltip && isDisabled && (
        <div 
          className="absolute z-50 w-48 bg-gray-800 text-white text-xs p-2 rounded shadow-lg left-0 -top-14 pointer-events-none"
          onMouseEnter={() => {
            if (tooltipTimeoutRef.current) {
              clearTimeout(tooltipTimeoutRef.current);
            }
            setShowTooltip(true);
          }}
        >
          <div className="flex items-start gap-1.5">
            <FiInfo className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <p>Select more than one channel to compare statistics</p>
          </div>
          <div className="absolute border-t-4 border-l-4 border-r-4 border-gray-800 border-r-transparent border-l-transparent h-0 w-0 bottom-[-8px] left-3"></div>
        </div>
      )}

      {/* Dropdown menu */}
      {isOpen && !isDisabled && (
        <div className="fixed z-50 mt-1 w-44 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden" style={{ top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + window.scrollY : 0, left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left + window.scrollX : 0 }}>
          {statTypeOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelect(option.value)}
            >
              <span className="text-gray-800 text-xs">{option.label}</span>
              {statType === option.value && <FiCheck className="text-blue-500 h-3.5 w-3.5" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 