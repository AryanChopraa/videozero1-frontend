"use client";

export default function VideoStatistics() {
  return (
    <div className="px-6 py-4">
      <h2 className="text-xl font-bold mb-4">Video statistics</h2>
      
      <div className="grid grid-cols-5 gap-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg">
            <div className="mb-3 bg-gray-200 rounded-lg w-full aspect-video relative overflow-hidden">
              {i === 0 && (
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded">
                    STOCK EXCHANGE
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center mb-2">
              <span className="inline-block w-4 h-4 mr-2 bg-blue-500 rounded-full"></span>
              <span className="text-xs text-gray-500">zerodhaofficial</span>
            </div>
            <div className="text-sm mb-4">stock exchange kya hota hai?</div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-gray-500">Total Views</div>
                <div className="font-bold">23.6M</div>
              </div>
              <div>
                <div className="text-gray-500">Total Views</div>
                <div className="font-bold">12K</div>
              </div>
              <div>
                <div className="text-gray-500">Total Views</div>
                <div className="font-bold">1.3M</div>
              </div>
              <div>
                <div className="text-gray-500">Total Views</div>
                <div className="font-bold">34K</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 