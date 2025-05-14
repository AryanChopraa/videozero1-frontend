"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import VideoStatistics from '../components/VideoStatistics';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout, fetchUserProfile } = useAuthStore();
  const profileFetched = useRef(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated && !loading && !profileFetched.current) {
      profileFetched.current = true;
      fetchUserProfile();
    }
  }, [isAuthenticated, loading, router, fetchUserProfile]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

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