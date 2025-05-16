import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

interface LoginParams {
  email: string;
  password: string;
}

interface SignupParams {
  email: string;
  password: string;
  org_name: string;
}

interface User {
  id: string;
  email: string;
  org_id: string;
  org_name: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  success: boolean;
  user: User;
}

interface ProfileResponse {
  success: boolean;
  user: User;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (params: LoginParams): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Login failed. Please try again.');
  }
};

export const signup = async (params: SignupParams): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/signup', params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Signup failed');
    }
    throw new Error('Signup failed. Please try again.');
  }
};

export const getUserData = async (): Promise<User> => {
  try {
    const response = await api.get<ProfileResponse>('/users/profile');
    if (response.data.success) {
      return response.data.user;
    }
    throw new Error('Failed to get user data');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get user data');
    }
    throw new Error('Failed to get user data. Please try again.');
  }
};

// YouTube OAuth functions
interface YouTubeAuthResponse {
  success: boolean;
  auth_url: string;
}

interface YouTubeCallbackParams {
  code: string;
  state: string;
}

export const getYouTubeAuthUrl = async (): Promise<string> => {
  try {
    const response = await api.get<YouTubeAuthResponse>('/youtube/auth');
    if (response.data.success) {
      return response.data.auth_url;
    }
    throw new Error('Failed to get YouTube auth URL');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get YouTube auth URL');
    }
    throw new Error('Failed to get YouTube authorization URL. Please try again.');
  }
};

export const handleYouTubeCallback = async (params: YouTubeCallbackParams): Promise<any> => {
  try {
    const response = await api.post('/youtube/callback', params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'YouTube authorization failed');
    }
    throw new Error('YouTube authorization failed. Please try again.');
  }
};

// Channel types and functions
interface Channel {
  id: string;
  channel_id: string;
  title: string;
  description: string;
  custom_url: string;
  thumbnail_url: string;
  view_count: number;
  subscriber_count: number;
  video_count: number;
  created_at: string;
  updated_at: string;
}

interface ChannelsResponse {
  success: boolean;
  channels: Channel[];
}

export const getChannels = async (): Promise<Channel[]> => {
  try {
    const response = await api.get<ChannelsResponse>('/channels/all');
    if (response.data.success) {
      return response.data.channels;
    }
    throw new Error('Failed to get channels');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get channels');
    }
    throw new Error('Failed to get channels. Please try again.');
  }
};

// Channel stats types and functions
interface ChannelStats {
  youtube_stats: {
    total_subscribers: number;
    total_views: number;
    video_count: number;
    period_views: number;
    period_watch_time_minutes: number;
    period_likes: number;
    period_dislikes: number;
    period_comments: number;
    period_subscribers_gained: number;
    period_subscribers_lost: number;
  };
  calculated_stats: {
    subscriber_growth_percentage: number;
    views_growth_percentage: number;
    watch_time_growth_percentage: number;
    likes_growth_percentage: number;
    dislikes_growth_percentage: number;
    comments_growth_percentage: number;
    total_watch_time_hours: number;
    total_watch_time_days: number;
    returning_viewers: number;
    returning_viewers_growth_percentage: number;
    unique_viewers: number;
    unique_viewers_growth_percentage: number;
  };
  start_date: string | null;
  end_date: string | null;
}

interface ChannelStatsResponse {
  success: boolean;
  stats: ChannelStats;
}

export const getChannelStats = async (
  channelId: string, 
  startDate?: string, 
  endDate?: string
): Promise<ChannelStats> => {
  try {
    let url = `/channels/stats?channel_id=${channelId}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;

    const response = await api.get<ChannelStatsResponse>(url);
    if (response.data.success) {
      return response.data.stats;
    }
    throw new Error('Failed to get channel stats');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get channel stats');
    }
    throw new Error('Failed to get channel stats. Please try again.');
  }
};

// Video types and functions
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

interface VideosResponse {
  success: boolean;
  videos: Video[];
}

export const getVideosByChannelId = async (channelId: string): Promise<Video[]> => {
  try {
    const response = await api.get<VideosResponse>(`/videos/by-channel/${channelId}`);
    if (response.data.success) {
      return response.data.videos;
    }
    throw new Error('Failed to get videos');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to get videos');
    }
    throw new Error('Failed to get videos. Please try again.');
  }
};

// New video fetching endpoint
interface FetchVideosParams {
  channel_ids: string[];
  start_date: string;
  end_date: string;
  sort_by: string;
  page: number;
}

interface FetchVideosResponse {
  success: boolean;
  videos: Video[];
  total: number;
  page: number;
  total_pages: number;
}

export const fetchVideos = async (params: FetchVideosParams): Promise<FetchVideosResponse> => {
  try {
    const response = await api.post<FetchVideosResponse>('/videos/fetch', params);
    if (response.data.success) {
      return response.data;
    }
    throw new Error('Failed to fetch videos');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch videos');
    }
    throw new Error('Failed to fetch videos. Please try again.');
  }
};

export type { User, AuthResponse, LoginParams, SignupParams, ProfileResponse, YouTubeAuthResponse, YouTubeCallbackParams, Channel, ChannelsResponse, ChannelStats, ChannelStatsResponse, Video, VideosResponse, FetchVideosParams, FetchVideosResponse }; 