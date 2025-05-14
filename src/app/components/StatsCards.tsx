"use client";

import { useEffect, useState, useRef } from 'react';
import { useFilterStore } from '../lib/store';
import { getChannelStats, ChannelStats } from '../lib/api';

export default function StatsCards() {
  const { selectedChannel, dateRange, channels } = useFilterStore();
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchInProgress = useRef(false);
  const lastFetchParams = useRef<{channel: string, dateRange: string} | null>(null);
  
  useEffect(() => {
    // Skip if no channel selected or 'all' is selected
    if (!selectedChannel || selectedChannel === 'all' || channels.length === 0) {
      setLoading(false);
      return;
    }
    
    // Skip repeated calls while a fetch is in progress
    if (fetchInProgress.current) return;
    
    // Skip if we already fetched with the same parameters
    if (lastFetchParams.current && 
        lastFetchParams.current.channel === selectedChannel && 
        lastFetchParams.current.dateRange === dateRange) {
      return;
    }
    
    const fetchStats = async () => {
      try {
        fetchInProgress.current = true;
        setLoading(true);
        setError(null);
        
        // Store current fetch parameters
        lastFetchParams.current = {
          channel: selectedChannel,
          dateRange: dateRange
        };
        
        // Find the selected channel in the channels array to get the channel_id
        const selectedChannelObj = channels.find(channel => channel.id === selectedChannel);
        
        if (!selectedChannelObj) {
          setError('Selected channel not found');
          setLoading(false);
          fetchInProgress.current = false;
          return;
        }
        
        // Get the actual YouTube channel_id needed for the API
        const youtubeChannelId = selectedChannelObj.channel_id;
        
        // Convert dateRange to actual dates
        let startDate, endDate;
        const today = new Date();
        
        if (dateRange === 'last30days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          startDate = thirtyDaysAgo.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
        } else if (dateRange === 'last90days') {
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(today.getDate() - 90);
          startDate = ninetyDaysAgo.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
        } else if (dateRange === 'last12months') {
          const twelveMonthsAgo = new Date();
          twelveMonthsAgo.setMonth(today.getMonth() - 12);
          startDate = twelveMonthsAgo.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
        }
        // If dateRange is 'all', we don't set startDate and endDate

        console.log(`Fetching stats for channel ${selectedChannel} with date range ${dateRange}`);
        const statsData = await getChannelStats(youtubeChannelId, startDate, endDate);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    };

    fetchStats();
  }, [selectedChannel, dateRange, channels]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg grid grid-cols-4 gap-6">
          {/* Skeleton Cards - 8 items to match the actual stats */}
          {[...Array(8)].map((_, index) => (
            <div key={index} className={`${index < 7 ? 'border-r border-gray-200 pr-6' : ''}`}>
              <div className="text-sm bg-gray-200 h-4 w-3/4 rounded animate-pulse mb-2"></div>
              <div className="flex items-end">
                <div className="bg-gray-300 h-8 w-1/2 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-center text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-center">Please select a channel to view stats</p>
        </div>
      </div>
    );
  }

  const { youtube_stats, calculated_stats } = stats;

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg grid grid-cols-4 gap-6">
        {/* Total Subscribers */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Total Subscribers</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.total_subscribers.toLocaleString()}</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Total Views</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.total_views.toLocaleString()}</div>
          </div>
        </div>

        {/* Video Count */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Video Count</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.video_count.toLocaleString()}</div>
          </div>
        </div>

        {/* Period Views */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Period Views</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.period_views.toLocaleString()}</div>
          </div>
        </div>

        {/* Watch Time */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Watch Time (minutes)</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.period_watch_time_minutes.toLocaleString()}</div>
          </div>
        </div>

        {/* Period Likes */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Likes</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.period_likes.toLocaleString()}</div>
          </div>
        </div>

        {/* Period Dislikes */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2">Dislikes</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.period_dislikes.toLocaleString()}</div>
          </div>
        </div>

        {/* Period Comments */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Subscribers Lost</div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.period_subscribers_lost.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 