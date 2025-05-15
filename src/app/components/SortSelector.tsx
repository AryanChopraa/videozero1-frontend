import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';

interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export default function SortSelector({ value, onChange, options, className = '' }: SortSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get label for the currently selected option
  const getSelectedLabel = () => {
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption ? selectedOption.label : options[0]?.label || '';
  };
  
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
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown header */}
      <div 
        className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md py-1.5 px-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs font-semibold">{getSelectedLabel()}</span>
        {isOpen ? <FiChevronUp className="h-3 w-3" /> : <FiChevronDown className="h-3 w-3" />}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="fixed z-50 mt-1 w-44 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden" style={{ top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + window.scrollY : 0, left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left + window.scrollX : 0 }}>
          {options.map((option) => (
            <div 
              key={option.value} 
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelect(option.value)}
            >
              <span className="text-gray-800 text-xs">{option.label}</span>
              {value === option.value && <FiCheck className="text-blue-500 h-3.5 w-3.5" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 