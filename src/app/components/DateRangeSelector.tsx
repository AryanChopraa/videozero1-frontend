import { useState, useEffect, useRef } from 'react';
import { FiCalendar, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useFilterStore } from '../lib/store';

interface DateRangeSelectorProps {
  className?: string;
}

export default function DateRangeSelector({ className = '' }: DateRangeSelectorProps) {
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedStartDay, setSelectedStartDay] = useState<number | null>(null);
  const [selectedEndDay, setSelectedEndDay] = useState<number | null>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  
  const { 
    dateRange, 
    customStartDate,
    customEndDate,
    setDateRange, 
    setCustomDateRange 
  } = useFilterStore();

  useEffect(() => {
    // Set local state from store when custom dates exist
    if (customStartDate && customEndDate && dateRange === 'custom') {
      setStartDate(customStartDate);
      setEndDate(customEndDate);
      
      const startDateObj = new Date(customStartDate);
      const endDateObj = new Date(customEndDate);
      
      if (startDateObj.getMonth() === currentMonth.getMonth() && 
          startDateObj.getFullYear() === currentMonth.getFullYear()) {
        setSelectedStartDay(startDateObj.getDate());
      }
      
      if (endDateObj.getMonth() === currentMonth.getMonth() && 
          endDateObj.getFullYear() === currentMonth.getFullYear()) {
        setSelectedEndDay(endDateObj.getDate());
      }
    }
  }, [customStartDate, customEndDate, dateRange, currentMonth]);

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

  const applyCustomDateRange = () => {
    if (startDate && endDate) {
      setDateRange('custom');
      setCustomDateRange(startDate, endDate);
      setIsDateDropdownOpen(false);
    }
  };

  const resetToAllTime = () => {
    setDateRange('allTime');
    setStartDate('');
    setEndDate('');
    setSelectedStartDay(null);
    setSelectedEndDay(null);
    setIsDateDropdownOpen(false);
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(formattedDate);
      setEndDate('');
      setSelectedStartDay(day);
      setSelectedEndDay(null);
    } else {
      // Complete selection
      const startDateObj = new Date(startDate);
      if (selectedDate >= startDateObj) {
        setEndDate(formattedDate);
        setSelectedEndDay(day);
      } else {
        // If clicked date is before start date, swap them
        setEndDate(startDate);
        setStartDate(formattedDate);
        setSelectedEndDay(selectedStartDay);
        setSelectedStartDay(day);
      }
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate calendar grid
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1).getDay();
    // Last day of the month (0 gets last day of previous month, so +1 month and 0 day)
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    // Adjust Sunday (0) to be 7 for easier calculation
    const adjustedFirstDay = firstDay === 0 ? 7 : firstDay;
    
    const days = [];
    
    // Add days from previous month if needed (to fill the first week)
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = 1; i < adjustedFirstDay; i++) {
      days.push({
        day: prevMonthLastDate - adjustedFirstDay + i + 1,
        isCurrentMonth: false,
        isPast: true
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDate; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isSelected: i === selectedStartDay || i === selectedEndDay ||
                    (selectedStartDay && selectedEndDay && i > selectedStartDay && i < selectedEndDay)
      });
    }
    
    // Add days from next month if needed (to fill the last week)
    const totalDaysToShow = 42; // 6 weeks × 7 days
    const nextMonthDays = totalDaysToShow - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isFuture: true
      });
    }
    
    return days;
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
    return 'All time';
  };

  const days = generateCalendar();
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <div className={`relative ${className}`} ref={dateDropdownRef}>
      <div 
        className="flex items-center justify-between bg-white border border-gray-300 rounded-md py-2 px-3 w-64 cursor-pointer"
        onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
      >
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-500" />
          <span className="text-sm">{getCurrentDateRangeLabel()}</span>
        </div>
        <FiChevronDown className="h-4 w-4 text-gray-500" />
      </div>
      
      {isDateDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 py-2 z-10 w-96">          
          <div className="p-4">
            <div className="mb-2 text-xs font-medium text-gray-500">Custom date range</div>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs text-gray-500 mb-1">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs text-gray-500 mb-1">End date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-medium">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="flex gap-2">
                  <button onClick={previousMonth} className="p-1 rounded-full hover:bg-gray-100">
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map(day => (
                  <div key={day} className="text-center py-1 text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {days.map((day, index) => (
                  <div 
                    key={index}
                    onClick={() => day.isCurrentMonth && handleDayClick(day.day)}
                    className={`
                      text-center py-2 text-sm rounded-md cursor-pointer
                      ${!day.isCurrentMonth ? 'text-gray-300' : 'hover:bg-gray-100'}
                      ${day.isSelected ? 'bg-gray-200' : ''}
                      ${day.day === selectedStartDay || day.day === selectedEndDay ? 'bg-black text-white' : ''}
                    `}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full mt-4">
              <button
                onClick={applyCustomDateRange}
                className="bg-black text-white py-2 rounded-md text-sm w-full"
              >
                Apply
              </button>
            </div>
            <div className="flex justify-center mt-3">
              <span 
                onClick={resetToAllTime}
                className="text-sm text-blue-600 underline cursor-pointer"
              >
                Reset to all time
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 