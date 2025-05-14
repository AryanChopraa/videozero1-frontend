"use client";

export default function StatsCards() {
  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg grid grid-cols-4 gap-6">
        {/* Total Subscribers */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Total Subscribers</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">1.2M</div>
            <div className="ml-2 text-sm text-green-500">+2.4%</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Total Views</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">23.6M</div>
            <div className="ml-2 text-sm text-red-500">-2.4%</div>
          </div>
        </div>

        {/* Total Watchtime */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Total Watchtime</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">24<span className="text-sm text-gray-500 ml-1">days</span> 36<span className="text-sm text-gray-500 ml-1">hours</span></div>
          </div>
        </div>

        {/* Total Likes */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Total likes</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">6.4M</div>
            <div className="ml-2 text-sm text-green-500">+2.4%</div>
          </div>
        </div>

        {/* Total Dislikes */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Total Dislikes</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">6.4M</div>
            <div className="ml-2 text-sm text-red-500">-2.4%</div>
          </div>
        </div>

        {/* Total Comments */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Total Comments</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">8.1k</div>
            <div className="ml-2 text-sm text-green-500">+2.4%</div>
          </div>
        </div>

        {/* Returning viewers */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Returning viewers</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">8.1k</div>
            <div className="ml-2 text-sm text-green-500">+2.4%</div>
          </div>
        </div>

        {/* Unique viewers */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Unique viewers</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">8.1k</div>
            <div className="ml-2 text-sm text-green-500">+2.4%</div>
          </div>
        </div>
      </div>
    </div>
  );
} 