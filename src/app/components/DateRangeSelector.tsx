import { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useFilterStore } from '../lib/store';
import Image from 'next/image';

interface DateRangeSelectorProps {
  className?: string;
}

// Helper function to format a Date object to YYYY-MM-DD string based on local date parts
const formatDateToYyyyMmDd = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth is 0-indexed
  const dayOfMonth = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${dayOfMonth}`;
};

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
      const startDateObj = new Date(customStartDate);
      const endDateObj = new Date(customEndDate);

      setStartDate(customStartDate);
      setEndDate(customEndDate);
      
      // Set currentMonth to the month of the startDate so calendar opens to it
      setCurrentMonth(new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1));
      
      // These will be set by generateCalendar based on startDate and endDate
      // setSelectedStartDay(startDateObj.getDate());
      // setSelectedEndDay(endDateObj.getDate());

    } else if (dateRange === 'allTime') {
      setStartDate('');
      setEndDate('');
      setSelectedStartDay(null);
      setSelectedEndDay(null);
    }
  }, [customStartDate, customEndDate, dateRange, setCustomDateRange]); // Added setCustomDateRange for completeness, though not directly used here for setting

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

  const handleStartDateClick = () => {
    // No action needed, calendar interaction drives selection
  };

  const handleEndDateClick = () => {
    // No action needed, calendar interaction drives selection
  };

  const handleDayClick = (day: number, date: Date) => {
    const formattedDate = formatDateToYyyyMmDd(date);
    
    if (!startDate || (startDate && endDate)) {
      // Either no start date yet, or both are set (so, reset)
      setStartDate(formattedDate);
      setSelectedStartDay(day);
      setEndDate('');
      setSelectedEndDay(null);
    } else if (startDate && !endDate) {
      // Start date is set, now setting end date
      const startDateObj = new Date(startDate);
      if (date < startDateObj) {
        // Selected end date is before start date, so make this the new start date
        setStartDate(formattedDate);
        setSelectedStartDay(day);
        setEndDate('');
        setSelectedEndDay(null);
      } else {
        setEndDate(formattedDate);
        setSelectedEndDay(day);
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
    
    const daysArray = [];
    
    // Add days from previous month if needed (to fill the first week)
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = 1; i < adjustedFirstDay; i++) {
      daysArray.push({
        day: prevMonthLastDate - adjustedFirstDay + i + 1,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDate - adjustedFirstDay + i + 1)
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      const dateString = formatDateToYyyyMmDd(date);
      
      daysArray.push({
        day: i,
        isCurrentMonth: true,
        date: date,
        isStartDate: startDate && dateString === startDate,
        isEndDate: endDate && dateString === endDate
      });
    }
    
    // Add days from next month if needed (to fill the last week)
    const remainingDays = (6 * 7) - daysArray.length;
    for (let i = 1; i <= remainingDays; i++) {
      daysArray.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return daysArray;
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

  // Format date for display in the input field
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      // dateStr is "YYYY-MM-DD". Split it to get parts.
      const [year, month, day] = dateStr.split('-').map(Number);
      // Create a date object. JS months are 0-indexed.
      // This date will be for 00:00:00 in the local timezone.
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date for display:", dateStr, e);
      return dateStr; // Fallback to raw string if formatting fails
    }
  };

  const days = generateCalendar();
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={`relative ${className}`} ref={dateDropdownRef}>
      <div 
        className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md py-1.5 px-2 w-52 cursor-pointer"
        onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
      >
        <div className="flex items-center space-x-2">
          <Image src="/icons/calender.svg" alt="Calendar" width={16} height={16} />
          <span className="text-[11px] font-semibold">{getCurrentDateRangeLabel()}</span>
        </div>
        <FiChevronDown className="h-3 w-3 text-gray-500" />
      </div>
      
      {isDateDropdownOpen && (
        <div className="fixed z-50 mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-4 w-[300px]" style={{ 
          top: dateDropdownRef.current ? dateDropdownRef.current.getBoundingClientRect().bottom + window.scrollY : 0, 
          left: dateDropdownRef.current ? Math.max(0, dateDropdownRef.current.getBoundingClientRect().left + window.scrollX - 100) : 0 
        }}>          
          <div className="flex gap-2 mb-4">
            <div 
              className={`flex-1 relative rounded-md border border-gray-200 px-3 py-2 cursor-default`}
              onClick={handleStartDateClick}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs ${startDate ? 'font-medium' : 'text-gray-400'}`}>
                  {startDate ? formatDateForDisplay(startDate) : 'Start date'}
                </span>
                <Image src="/icons/calender.svg" alt="Calendar" width={18} height={18} />
              </div>
            </div>
            
            <div 
              className={`flex-1 relative rounded-md border border-gray-200 px-3 py-2 cursor-default`}
              onClick={handleEndDateClick}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs ${endDate ? 'font-medium' : 'text-gray-400'}`}>
                  {endDate ? formatDateForDisplay(endDate) : 'End date'}
                </span>
                <Image src="/icons/calender.svg" alt="Calendar" width={18} height={18} />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div 
                className="flex items-center gap-1 cursor-pointer" 
              >
                <span className="text-sm font-medium">
                  {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button onClick={previousMonth} className="p-1 rounded-full hover:bg-gray-100">
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div key={day} className="text-center py-1 text-[10px] font-medium text-gray-500">
                  {day}
                </div>
              ))}
              
              {days.map((day, index) => (
                <div 
                  key={index}
                  onClick={() => day.isCurrentMonth && handleDayClick(day.day, day.date)}
                  className={`
                    text-center py-1.5 text-[10px] rounded-md cursor-pointer
                    ${!day.isCurrentMonth ? 'text-gray-300' : 'hover:bg-gray-100'}
                    ${(day.isStartDate || day.isEndDate) ? 'bg-black text-white font-bold' : ''}
                  `}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={applyCustomDateRange}
            disabled={!startDate || !endDate}
            className={`
              py-2 rounded-md text-xs w-full
              ${(!startDate || !endDate) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}
            `}
          >
            Apply
          </button>
          
          <div className="flex justify-center mt-3">
            <span 
              onClick={resetToAllTime}
              className="text-[10px] text-gray-500 underline cursor-pointer"
            >
              Reset
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 