"use client";

interface Video {
  id: string;
  video_id: string;
  channel_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  published_at: string;
  duration: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

interface VideoCardProps {
  video: Video;
  showDuration?: boolean;
  channelName?: string;
  channelThumbnail?: string;
  className?: string;
}

export default function VideoCard({ 
  video, 
  showDuration = false, 
  channelName,
  channelThumbnail,
  className = ""
}: VideoCardProps) {
  const formattedDuration = video.duration
    ? video.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm ').replace('S', 's')
    : '';

  return (
    <div className={`rounded-lg overflow-hidden ${className} border border-[#E0E0E0] h-full flex flex-col`}>
      {/* First main div: thumbnail, logo, channel name, and title */}
      <div className="bg-[#F6F6F6] p-3">
        <div className="relative">
          <div className="w-full aspect-video relative overflow-hidden rounded-lg">
            <img 
              src={video.thumbnail_url} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40"></div>
            
            {showDuration && (
              <div className="absolute right-2 top-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                {formattedDuration}
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4 px-2">
          <div className="flex items-center mb-2">
            <img 
              src={channelThumbnail} 
              alt={channelName || video.channel_id}
              className="w-5 h-5 mr-2 rounded-full flex-shrink-0 object-cover"
            />
            <span className="text-sm text-gray-700 font-medium">{channelName || video.channel_id}</span>
          </div>
          
          <div className="mb-3 text-black font-bold text-md h-12 line-clamp-2">{video.title}</div>
        </div>
      </div>
      
      {/* Second main div: metrics */}
      <div className="px-2 pt-2 pb-3 bg-white border-t border-[#E0E0E0]">
        <div className="grid grid-cols-4 gap-1">
          <div className="text-gray-500 text-[10px] text-center whitespace-nowrap">Total Views</div>
          <div className="text-gray-500 text-[10px] text-center whitespace-nowrap">Total Likes</div>
          <div className="text-gray-500 text-[10px] text-center whitespace-nowrap">Total Comments</div>
          <div className="text-gray-500 text-[10px] text-center whitespace-nowrap">Duration</div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          <div className="font-bold text-gray-900 text-base text-center">
            {(video.view_count >= 1000000) 
              ? `${(video.view_count / 1000000).toFixed(1)}M` 
              : (video.view_count >= 1000) 
                ? `${(video.view_count / 1000).toFixed(0)}K` 
                : video.view_count.toLocaleString()}
          </div>
          <div className="font-bold text-gray-900 text-base text-center">
            {video.like_count >= 1000 
              ? `${(video.like_count / 1000).toFixed(0)}K`
              : video.like_count}
          </div>
          <div className="font-bold text-gray-900 text-base text-center">
            {video.comment_count >= 1000 
              ? `${(video.comment_count / 1000).toFixed(0)}K` 
              : video.comment_count}
          </div>
          <div className="font-bold text-gray-900 text-base text-center">
            {formattedDuration}
          </div>
        </div>
      </div>
    </div>
  );
} 


