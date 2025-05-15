import { FiChevronDown } from 'react-icons/fi';
import { useFilterStore } from '../lib/store';

interface StatTypeSelectorProps {
  className?: string;
}

export default function StatTypeSelector({ className = '' }: StatTypeSelectorProps) {
  const { statType, setStatType } = useFilterStore();

  const statTypeOptions = [
    { value: 'total', label: 'Total stats' },
    { value: 'average', label: 'Average stats' },
  ];

  return (
    <div className={`relative ${className}`}>
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
        <FiChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
} 