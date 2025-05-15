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
  className?: string;
}

export default function VideoCard({ 
  video, 
  showDuration = false, 
  channelName,
  className = ""
}: VideoCardProps) {
  const formattedDuration = video.duration
    ? video.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm ').replace('S', 's')
    : '';

  return (
    <div className={`bg-white rounded-lg overflow-hidden ${className}`}>
      <div className="relative">
        <div className="mb-3 bg-gray-200 rounded-lg w-full aspect-video relative overflow-hidden">
          <img 
            src={video.thumbnail_url} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {showDuration && (
            <div className="absolute right-2 top-2 bg-black text-white text-xs px-2 py-1 rounded">
              {formattedDuration}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <span className="inline-block w-4 h-4 mr-2 bg-blue-500 rounded-full"></span>
          <span className="text-xs text-gray-500">{channelName || video.channel_id}</span>
        </div>
        
        <div className="text-sm mb-4 font-medium line-clamp-2">{video.title}</div>
        
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div>
            <div className="text-gray-500">Total Views</div>
            <div className="font-bold">{video.view_count.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-500">Total Likes</div>
            <div className="font-bold">{Math.floor(video.like_count/10)}K</div>
          </div>
          <div>
            <div className="text-gray-500">Total Comments</div>
            <div className="font-bold">{Math.floor(video.comment_count*3)}K</div>
          </div>
          <div>
            <div className="text-gray-500">Total Shares</div>
            <div className="font-bold">{Math.floor(video.view_count/20)}M</div>
          </div>
        </div>
      </div>
    </div>
  );
} 