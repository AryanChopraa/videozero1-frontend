"use client";

import { useEffect, useState, useRef } from "react";
import { useFilterStore } from "../lib/store";
import { useAuthStore } from "../lib/store";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import Link from "next/link";
import VideoCard from "../components/VideoCard";
import ChannelSelector from "../components/ChannelSelector";
import DateRangeSelector from "../components/DateRangeSelector";
import SortSelector from "../components/SortSelector";

export default function VideosPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, fetchUserProfile } = useAuthStore();
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const profileFetched = useRef(false);
  
  const { 
    selectedChannels,
    dateRange,
    setDateRange,
    videos,
    isLoadingVideos,
    videoError,
    fetchVideos,
    channels
  } = useFilterStore();

  const [sortBy, setSortBy] = useState("views");
  
  const sortOptions = [
    { value: "views", label: "Most views" },
    { value: "likes", label: "Most likes" },
    { value: "comments", label: "Most comments" },
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" }
  ];

  // Handle hydration mismatch by confirming client-side rendering is complete
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  useEffect(() => {
    // Only run auth checks after client-side hydration is complete
    if (!isClientLoaded) return;

    // Don't redirect immediately if still loading
    if (loading) return;

    // Only redirect to login if we're definitely not authenticated
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      // Store the intended destination to return after login
      sessionStorage.setItem('redirectAfterLogin', '/videos');
      router.push('/login');
    } else if (!profileFetched.current) {
      // Only fetch profile once when authenticated
      profileFetched.current = true;
      console.log("Authenticated, fetching profile");
      fetchUserProfile();
    }
  }, [isAuthenticated, loading, router, fetchUserProfile, isClientLoaded]);

  useEffect(() => {
    // Check if channels are available and at least one channel is selected
    if (channels.length > 0 && selectedChannels.length > 0) {
      // Fetch videos when selectedChannels or dateRange changes
      fetchVideos();
    }
  }, [selectedChannels, dateRange, channels, fetchVideos]);

  // Sort videos based on selected sort criteria
  const sortedVideos = [...videos].sort((a, b) => {
    switch(sortBy) {
      case "views":
        return b.view_count - a.view_count;
      case "likes":
        return b.like_count - a.like_count;
      case "comments":
        return b.comment_count - a.comment_count;
      case "newest":
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      case "oldest":
        return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
      default:
        return b.view_count - a.view_count;
    }
  });

  // Only show loading state if actually still loading auth
  if (!isClientLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render anything during redirect to login
  if (!isAuthenticated || !user) {
    return null;
  }

  // Channel selection message for the header
  const channelSelectionMessage = 
    selectedChannels.length === 1 
      ? `for ${channels.find(c => c.id === selectedChannels[0])?.title || "selected channel"}`
      : selectedChannels.length > 1 
        ? `across ${selectedChannels.length} channels` 
        : "";

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Video statistics</h1>
          <div className="flex space-x-4">
            <ChannelSelector />
            <DateRangeSelector />
            <SortSelector 
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
            />
          </div>
        </div>
        
        {isLoadingVideos ? (
          <div className="text-center py-20">Loading videos...</div>
        ) : videoError ? (
          <div className="text-center text-red-500 py-20">{videoError}</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            {selectedChannels.length === 0 ? 
              'Please select at least one channel to view videos' : 
              'No videos found for selected channels'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedVideos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                channelName={channels.find(c => c.channel_id === video.channel_id)?.title || "Unknown"}
                channelThumbnail={channels.find(c => c.channel_id === video.channel_id)?.thumbnail_url || "/placeholder-channel.png"}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
