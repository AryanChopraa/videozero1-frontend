"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useFilterStore } from '../lib/store';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import VideoStatistics from '../components/VideoStatistics';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout, fetchUserProfile } = useAuthStore();
  const { fetchChannels, channels } = useFilterStore();
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const profileFetched = useRef(false);
  const channelsFetched = useRef(false);

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
      sessionStorage.setItem('redirectAfterLogin', '/dashboard');
      router.push('/login');
    } else if (!profileFetched.current) {
      // Only fetch profile once when authenticated
      profileFetched.current = true;
      console.log("Authenticated, fetching profile");
      fetchUserProfile();
    }
  }, [isAuthenticated, loading, router, fetchUserProfile, isClientLoaded]);

  // Fetch channels when authenticated - only once
  useEffect(() => {
    if (isAuthenticated && isClientLoaded && !channelsFetched.current && channels.length === 0) {
      channelsFetched.current = true;
      fetchChannels();
    }
  }, [isAuthenticated, isClientLoaded, channels.length]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <StatsCards />
        <VideoStatistics />
      </div>
    </div>
  );
} 