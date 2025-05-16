"use client";

import { useEffect, useState, useRef } from 'react';
import { useFilterStore } from '../lib/store';
import { getChannelStats, ChannelStats } from '../lib/api';

export default function StatsCards() {
  const { 
    selectedChannels, 
    dateRange, 
    customStartDate, 
    customEndDate,
    statType,
    channels 
  } = useFilterStore();
  
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [combinedStats, setCombinedStats] = useState<ChannelStats | null>(null);
  const [averageStats, setAverageStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchInProgress = useRef(false);
  const lastFetchParams = useRef<{channels: string[], dateRange: string, customStart?: string, customEnd?: string} | null>(null);
  
  useEffect(() => {
    // Skip if no channels selected
    if (selectedChannels.length === 0 || channels.length === 0) {
      setLoading(false);
      return;
    }
    
    // Skip repeated calls while a fetch is in progress
    if (fetchInProgress.current) return;
    
    // Skip if we already fetched with the same parameters
    if (lastFetchParams.current && 
        JSON.stringify(lastFetchParams.current.channels) === JSON.stringify(selectedChannels) && 
        lastFetchParams.current.dateRange === dateRange &&
        (dateRange !== 'custom' || 
          (lastFetchParams.current.customStart === customStartDate && 
           lastFetchParams.current.customEnd === customEndDate))) {
      return;
    }
    
    const fetchStats = async () => {
      try {
        fetchInProgress.current = true;
        setLoading(true);
        setError(null);
        
        // Store current fetch parameters
        lastFetchParams.current = {
          channels: [...selectedChannels],
          dateRange: dateRange,
          ...(dateRange === 'custom' && { 
            customStart: customStartDate || undefined, 
            customEnd: customEndDate || undefined 
          })
        };
        
        // Convert dateRange to actual dates
        let startDate, endDate;
        const today = new Date();
        
        if (dateRange === 'last30days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          startDate = thirtyDaysAgo.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
        } else if (dateRange === 'last60days') {
          const sixtyDaysAgo = new Date();
          sixtyDaysAgo.setDate(today.getDate() - 60);
          startDate = sixtyDaysAgo.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
        } else if (dateRange === 'last90days') {
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(today.getDate() - 90);
          startDate = ninetyDaysAgo.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
        } else if (dateRange === 'lastYear' || dateRange === 'last12months') {
          const yearAgo = new Date();
          yearAgo.setFullYear(today.getFullYear() - 1);
          startDate = yearAgo.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
        } else if (dateRange === 'custom') {
          // Use the custom date range from the store
          if (customStartDate && customEndDate) {
            startDate = customStartDate;
            endDate = customEndDate;
          } else {
            setError('Custom date range not properly set');
            setLoading(false);
            fetchInProgress.current = false;
            return;
          }
        } else if (dateRange === 'allTime') {
          // For allTime, we don't set dates - API will return all data
          console.log('All time range selected');
        }

        console.log(`Fetching stats for ${selectedChannels.length} channels with date range ${dateRange}`);
        if (startDate && endDate) {
          console.log(`Date range: ${startDate} to ${endDate}`);
        }

        // If only one channel is selected, fetch its stats
        if (selectedChannels.length === 1) {
          const selectedChannelObj = channels.find(channel => channel.id === selectedChannels[0]);
          
          if (!selectedChannelObj) {
            setError('Selected channel not found');
            setLoading(false);
            fetchInProgress.current = false;
            return;
          }
          
          // Get the actual YouTube channel_id needed for the API
          const youtubeChannelId = selectedChannelObj.channel_id;
          const statsData = await getChannelStats(youtubeChannelId, startDate, endDate);
          setStats(statsData);
          setCombinedStats(null);
          setAverageStats(null);
        } else {
          // Multiple channels - fetch stats for each and combine
          const allStats: ChannelStats[] = [];
          let fetchError = null;

          for (const channelId of selectedChannels) {
            try {
              const selectedChannelObj = channels.find(channel => channel.id === channelId);
              if (selectedChannelObj) {
                const youtubeChannelId = selectedChannelObj.channel_id;
                const channelStats = await getChannelStats(youtubeChannelId, startDate, endDate);
                allStats.push(channelStats);
              }
            } catch (err) {
              fetchError = err;
              console.error(`Error fetching stats for channel ${channelId}:`, err);
            }
          }

          if (allStats.length === 0 && fetchError) {
            throw fetchError;
          }

          // Combine stats from all channels (total)
          const combined = allStats.reduce((acc: ChannelStats | null, current: ChannelStats) => {
            if (!acc) return current;
            
            return {
              youtube_stats: {
                total_subscribers: acc.youtube_stats.total_subscribers + current.youtube_stats.total_subscribers,
                total_views: acc.youtube_stats.total_views + current.youtube_stats.total_views,
                video_count: acc.youtube_stats.video_count + current.youtube_stats.video_count,
                period_views: acc.youtube_stats.period_views + current.youtube_stats.period_views,
                period_watch_time_minutes: acc.youtube_stats.period_watch_time_minutes + current.youtube_stats.period_watch_time_minutes,
                period_likes: acc.youtube_stats.period_likes + current.youtube_stats.period_likes,
                period_dislikes: acc.youtube_stats.period_dislikes + current.youtube_stats.period_dislikes,
                period_subscribers_lost: acc.youtube_stats.period_subscribers_lost + current.youtube_stats.period_subscribers_lost,
                period_comments: acc.youtube_stats.period_comments + current.youtube_stats.period_comments,
                period_subscribers_gained: acc.youtube_stats.period_subscribers_gained + current.youtube_stats.period_subscribers_gained
              },
              calculated_stats: current.calculated_stats, // Just use the last one as these are ratios
              start_date: acc.start_date, // Keep the original start_date
              end_date: acc.end_date // Keep the original end_date
            };
          }, null as ChannelStats | null);

          // Calculate average stats
          const average = allStats.length > 0 ? {
            youtube_stats: {
              total_subscribers: Math.round(combined!.youtube_stats.total_subscribers / allStats.length),
              total_views: Math.round(combined!.youtube_stats.total_views / allStats.length),
              video_count: Math.round(combined!.youtube_stats.video_count / allStats.length),
              period_views: Math.round(combined!.youtube_stats.period_views / allStats.length),
              period_watch_time_minutes: Math.round(combined!.youtube_stats.period_watch_time_minutes / allStats.length),
              period_likes: Math.round(combined!.youtube_stats.period_likes / allStats.length),
              period_dislikes: Math.round(combined!.youtube_stats.period_dislikes / allStats.length),
              period_subscribers_lost: Math.round(combined!.youtube_stats.period_subscribers_lost / allStats.length),
              period_comments: combined!.youtube_stats.period_comments / allStats.length,
              period_subscribers_gained: Math.round(combined!.youtube_stats.period_subscribers_gained / allStats.length)
            },
            calculated_stats: combined!.calculated_stats,
            start_date: combined!.start_date,
            end_date: combined!.end_date
          } : null;

          setCombinedStats(combined);
          setAverageStats(average);
          setStats(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    };

    fetchStats();
  }, [selectedChannels, dateRange, customStartDate, customEndDate, channels]);

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

  if (!stats && !combinedStats && !averageStats) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-center">Please select at least one channel to view stats</p>
        </div>
      </div>
    );
  }

  // Select which stats to display based on statType and available data
  let displayStats;
  if (stats) {
    // If it's a single channel, just use its stats
    displayStats = stats;
  } else if (selectedChannels.length > 1) {
    // For multiple channels, use the appropriate stats based on statType
    displayStats = statType === 'average' ? averageStats : combinedStats;
  } else {
    // Fallback
    displayStats = combinedStats || averageStats;
  }
  
  if (!displayStats) {
    return null;
  }

  const { youtube_stats } = displayStats;

  return (
    <div className="p-6">
      <div className="bg-[#F6F6F6] px-10 py-14 rounded-lg grid grid-cols-4 gap-6 border border-[#E0E0E0]">
        {/* Total Subscribers */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2 font-semibold">
            {statType === 'average' && selectedChannels.length > 1 ? 'Average Subscribers' : 'Total Subscribers'}
          </div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.total_subscribers.toLocaleString()}</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2 font-semibold">
            {statType === 'average' && selectedChannels.length > 1 ? 'Average Views' : 'Total Views'}
          </div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.total_views.toLocaleString()}</div>
          </div>
        </div>

        {/* Video Count */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2 font-semibold">
            {statType === 'average' && selectedChannels.length > 1 ? 'Average Video Count' : 'Video Count'}
          </div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.video_count.toLocaleString()}</div>
          </div>
        </div>

        {/* Period Views */}
        <div>
          <div className="text-sm text-gray-500 mb-2 font-semibold">
            {statType === 'average' && selectedChannels.length > 1 ? 'Average Period Views' : 'Period Views'}
          </div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.period_views.toLocaleString()}</div>
          </div>
        </div>

        {/* Watch Time */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2 font-semibold">
            {statType === 'average' && selectedChannels.length > 1 ? 'Average Watch Time (min)' : 'Watch Time (minutes)'}
          </div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.period_watch_time_minutes.toLocaleString()}</div>
          </div>
        </div>

        {/* Period Likes */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2 font-semibold">
            {statType === 'average' && selectedChannels.length > 1 ? 'Average Likes' : 'Likes'}
          </div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.period_likes.toLocaleString()}</div>
          </div>
        </div>

        {/* Period Dislikes */}
        <div className="border-r border-gray-200 pr-6">
          <div className="text-sm text-gray-500 mb-2 font-semibold">
            {statType === 'average' && selectedChannels.length > 1 ? 'Average Dislikes' : 'Dislikes'}
          </div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.period_dislikes.toLocaleString()}</div>
          </div>
        </div>

        {/* Period Comments */}
        <div>
          <div className="text-sm text-gray-500 mb-2 font-semibold">
            {statType === 'average' && selectedChannels.length > 1 ? 'Average Subscribers Lost' : 'Subscribers Lost'}
          </div>
          <div className="flex items-end">
            <div className="text-3xl font-bold">{youtube_stats.period_subscribers_lost.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 