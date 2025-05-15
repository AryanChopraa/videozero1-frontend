"use client";

import { useEffect, useState, useRef } from "react";
import { useFilterStore } from "../lib/store";
import { useAuthStore } from "../lib/store";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import Link from "next/link";
import VideoCard from "../components/VideoCard";

export default function VideosPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, fetchUserProfile } = useAuthStore();
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const profileFetched = useRef(false);
  
  const { 
    selectedChannel,
    setSelectedChannel,
    dateRange,
    setDateRange,
    videos,
    isLoadingVideos,
    videoError,
    fetchVideos,
    channels
  } = useFilterStore();

  const [sortBy, setSortBy] = useState("views");

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
    // Check if channels are available
    if (channels.length > 0 && selectedChannel && selectedChannel !== 'all') {
      // Fetch videos when selectedChannel changes
      fetchVideos();
    }
  }, [selectedChannel, channels, fetchVideos]);

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

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Video statistics</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
              >
                <option value="all">All channels</option>
                {channels.map(channel => (
                  <option key={channel.id} value={channel.id}>
                    {channel.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="allTime">Jan 1, 2023 - May 2, 2025</option>
                <option value="last30days">Last 30 days</option>
                <option value="last90days">Last 90 days</option>
                <option value="last12months">Last year</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="views">Most views</option>
                <option value="likes">Most likes</option>
                <option value="comments">Most comments</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {isLoadingVideos ? (
          <div className="text-center py-20">Loading videos...</div>
        ) : videoError ? (
          <div className="text-center text-red-500 py-20">{videoError}</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            {selectedChannel === 'all' ? 
              'Please select a specific channel to view videos' : 
              'No videos found for this channel'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedVideos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                showDuration={true}
                className="shadow"
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
