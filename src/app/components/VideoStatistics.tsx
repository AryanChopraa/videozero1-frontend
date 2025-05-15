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

export default function VideoStatistics() {
  const { 
    selectedChannels,
    videos,
    isLoadingVideos,
    videoError,
    fetchVideos,
    channels
  } = useFilterStore();

  useEffect(() => {
    // Check if channels are available and at least one channel is selected
    if (channels.length > 0 && selectedChannels.length > 0) {
      // Fetch videos when selectedChannels changes
      fetchVideos();
    }
  }, [selectedChannels, channels, fetchVideos]);

  // Get only top 4 videos sorted by view count
  // Videos are already filtered by selectedChannels in the store's fetchVideos function
  const topVideos = [...videos]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 4);

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
        <Link href="/videos" className="text-sm text-blue-600 hover:text-blue-800">
          view all →
        </Link>
      </div>
      
      {isLoadingVideos ? (
        <div className="text-center py-10">Loading videos...</div>
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
              className=""
            />
          ))}
        </div>
      )}
    </div>
  );
} 