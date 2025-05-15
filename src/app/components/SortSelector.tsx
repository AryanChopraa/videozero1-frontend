import { FiChevronDown } from 'react-icons/fi';

interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export default function SortSelector({ value, onChange, options, className = '' }: SortSelectorProps) {
  return (
    <div className={`relative ${className}`}>
      <select 
        className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <FiChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
} 