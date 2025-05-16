"use client";
import { useEffect } from "react";
import { useFilterStore } from "../lib/store";
import Link from "next/link";
import VideoCard from "./VideoCard";

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

// Skeleton loader component for video cards
const VideoCardSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden border border-[#E0E0E0] h-full flex flex-col">
      <div className="bg-[#F6F6F6] p-3">
        <div className="relative">
          <div className="w-full aspect-video relative overflow-hidden rounded-lg bg-gray-200 animate-pulse"></div>
        </div>
        
        <div className="pt-4 px-2">
          <div className="flex items-center mb-2">
            <div className="w-5 h-5 mr-2 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
          
          <div className="mb-3 h-12">
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="px-2 pt-2 pb-3 bg-white border-t border-[#E0E0E0]">
        <div className="grid grid-cols-4 gap-1">
          <div className="h-3 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-3 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-3 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-3 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-4 gap-1 mt-2">
          <div className="h-4 w-10 mx-auto bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-10 mx-auto bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-10 mx-auto bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-10 mx-auto bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default function VideoStatistics() {
  const { 
    selectedChannels,
    videos,
    isLoadingVideos,
    videoError,
    fetchVideos,
    channels,
    dateRange,
    customStartDate,
    customEndDate
  } = useFilterStore();

  useEffect(() => {
    // Check if channels are available and at least one channel is selected
    if (channels.length > 0 && selectedChannels.length > 0) {
      // Fetch videos when selectedChannels, dateRange, customStartDate, or customEndDate changes
      fetchVideos("views", 1); // "views" will be mapped to "most_views" in the store
    } else if (selectedChannels.length === 0) {
      // Clear videos if no channels are selected
      // This might be handled in the store already, but good to be explicit if needed
      // useFilterStore.setState({ videos: [], isLoadingVideos: false, videoError: null });
    }
  }, [selectedChannels, channels, fetchVideos, dateRange, customStartDate, customEndDate]); // Added date dependencies

  // Get only top 4 videos.
  // The store's fetchVideos already sorts by "most_views" when "views" is passed and fetches page 1.
  // The API `fetchVideos` (in api.ts) is called with `sort_by: 'most_views'` and `page: 1`.
  // The response `result.videos` from the API should already contain the top videos if the backend sorts correctly.
  // Slicing here ensures we only display a maximum of 4, even if the API/store returns more on page 1.
  const topVideos = videos.slice(0, 4);

  // Channel selection message for the header
  const channelSelectionMessage = 
    selectedChannels.length === 1 
      ? `from ${channels.find(c => c.id === selectedChannels[0])?.title || "selected channel"}`
      : selectedChannels.length > 1 
        ? `across ${selectedChannels.length} channels` 
        : "";

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Top Performing Videos 
        </h2>
        <Link href="/videos" className="text-sm hover:text-blue-800 underline">
          view all →
        </Link>
      </div>
      
      {isLoadingVideos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : videoError ? (
        <div className="text-center text-red-500 py-10">{videoError}</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-10">
          {selectedChannels.length === 0 ? 
            'Please select at least one channel to view videos' : 
            'No videos found for selected channels'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topVideos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              channelName={channels.find(c => c.channel_id === video.channel_id)?.title || "Unknown"}
              channelThumbnail={channels.find(c => c.channel_id === video.channel_id)?.thumbnail_url || "/placeholder-channel.png"}
              className=""
            />
          ))}
        </div>
      )}
    </div>
  );
} 