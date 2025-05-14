"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleYouTubeCallback } from '../../lib/api';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import StatsCards from '../../components/StatsCards';
import VideoStatistics from '../../components/VideoStatistics';

export default function YouTubeDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processOAuthCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (code && state) {
        try {
          await handleYouTubeCallback({ code, state });
        } catch (error) {
          console.error('Error handling YouTube callback:', error);
        }
      }
      
      // Redirect to /dashboard after response is received
      router.push('/dashboard');
    };

    processOAuthCallback();
  }, [searchParams, router]);

  // Show skeleton version of the dashboard while processing
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="animate-pulse">
          <StatsCards />
          <VideoStatistics />
        </div>
      </div>
    </div>
  );
} 