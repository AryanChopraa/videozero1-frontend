import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, signup as apiSignup, getUserData, getChannels, getVideosByChannelId, fetchVideos as apiFetchVideos, User, AuthResponse, Channel, Video } from './api';

interface LoginParams {
  email: string;
  password: string;
}

interface SignupParams {
  email: string;
  password: string;
  org_name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  login: (params: LoginParams) => Promise<void>;
  signup: (params: SignupParams) => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
}

interface FilterState {
  selectedChannels: string[];
  dateRange: string;
  statType: string;
  customStartDate: string | null;
  customEndDate: string | null;
  channels: Channel[];
  videos: Video[];
  isLoading: boolean;
  isLoadingVideos: boolean;
  error: string | null;
  videoError: string | null;
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  setSelectedChannels: (channelIds: string[]) => void;
  toggleChannel: (channelId: string) => void;
  setDateRange: (dateRange: string) => void;
  setStatType: (statType: string) => void;
  setCustomDateRange: (startDate: string, endDate: string) => void;
  fetchChannels: () => Promise<void>;
  fetchVideos: (sortBy?: string, page?: number) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      loading: false,
      error: null,
      
      login: async (params: LoginParams) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiLogin(params);
          
          if (response.success) {
            localStorage.setItem('access_token', response.access_token);
            
            set({
              isAuthenticated: true,
              user: response.user,
              accessToken: response.access_token,
              loading: false,
            });
          } else {
            set({ loading: false, error: 'Login failed' });
          }
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'An error occurred during login' 
          });
        }
      },
      
      signup: async (params: SignupParams) => {
        set({ loading: true, error: null });
        
        try {
          const response = await apiSignup(params);
          
          if (response.success) {
            localStorage.setItem('access_token', response.access_token);
            
            set({
              isAuthenticated: true,
              user: response.user,
              accessToken: response.access_token,
              loading: false,
            });
          } else {
            set({ loading: false, error: 'Signup failed' });
          }
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'An error occurred during signup' 
          });
        }
      },
      
      fetchUserProfile: async () => {
        if (get().loading) return;
        
        set({ loading: true, error: null });
        
        try {
          const userData = await getUserData();
          
          set({
            user: userData,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch user profile' 
          });
        }
      },
      
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      selectedChannels: [],
      dateRange: 'last30days',
      statType: 'total',
      customStartDate: null,
      customEndDate: null,
      channels: [],
      videos: [],
      isLoading: false,
      isLoadingVideos: false,
      error: null,
      videoError: null,
      currentPage: 1,
      totalPages: 1,
      totalVideos: 0,
      
      setSelectedChannels: (channelIds: string[]) => set({ selectedChannels: channelIds }),
      
      toggleChannel: (channelId: string) => set((state) => {
        const isSelected = state.selectedChannels.includes(channelId);
        if (isSelected) {
          return { selectedChannels: state.selectedChannels.filter(id => id !== channelId) };
        } else {
          return { selectedChannels: [...state.selectedChannels, channelId] };
        }
      }),
      
      setDateRange: (dateRange: string) => set({ dateRange }),
      setStatType: (statType: string) => set({ statType }),
      setCustomDateRange: (startDate: string, endDate: string) => set({ 
        customStartDate: startDate, 
        customEndDate: endDate,
        dateRange: 'custom' 
      }),
      
      setCurrentPage: (page: number) => set({ currentPage: page }),
      
      fetchChannels: async () => {
        const state = get();
        if (state.isLoading) return;
        
        set({ isLoading: true, error: null });
        try {
          const channelsData = await getChannels();
          set({ channels: channelsData, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch channels' 
          });
        }
      },
      
      fetchVideos: async (sortBy?: string, page?: number) => {
        const state = get();
        if (state.isLoadingVideos) return;
        
        // If no channels selected, return empty array
        if (state.selectedChannels.length === 0) {
          set({ videos: [], isLoadingVideos: false });
          return;
        }
        
        set({ isLoadingVideos: true, videoError: null });
        
        try {
          // Get channel_ids from the selectedChannels (which are our db IDs)
          const youtubeChannelIds = state.selectedChannels.map(channelId => {
            const channel = state.channels.find(c => c.id === channelId);
            return channel ? channel.channel_id : null;
          }).filter(Boolean) as string[];
          
          if (youtubeChannelIds.length === 0) {
            set({ 
              videos: [], 
              isLoadingVideos: false,
              videoError: 'No valid channels selected'
            });
            return;
          }
          
          // Determine date range based on state
          let startDate = '2020-01-01'; // default
          let endDate = new Date().toISOString().split('T')[0]; // today
          
          // Set date range based on selected option
          switch (state.dateRange) {
            case 'last7days':
              startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              break;
            case 'last30days':
              startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              break;
            case 'last90days':
              startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              break;
            case 'last12months':
              startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              break;
            case 'custom':
              if (state.customStartDate) startDate = state.customStartDate;
              if (state.customEndDate) endDate = state.customEndDate;
              break;
          }
          
          // Map sorting options to backend format
          const sortMapping: Record<string, string> = {
            'views': 'most_views',
            'least_views': 'least_views',
            'likes': 'most_likes',
            'comments': 'most_comments',
            'newest': 'newest_first',
            'oldest': 'oldest_first'
          };
          
          const sort = sortBy ? sortMapping[sortBy] || 'most_views' : 'most_views';
          const currentPage = page || state.currentPage;
          
          // Fetch videos using the new API
          const result = await apiFetchVideos({
            channel_ids: youtubeChannelIds,
            start_date: startDate,
            end_date: endDate,
            sort_by: sort,
            page: currentPage
          });
          
          set({ 
            videos: result.videos, 
            isLoadingVideos: false,
            totalPages: result.total_pages,
            totalVideos: result.total,
            currentPage: result.page
          });
        } catch (error) {
          set({ 
            isLoadingVideos: false, 
            videoError: error instanceof Error ? error.message : 'Failed to fetch videos',
            videos: []
          });
        }
      }
    }),
    {
      name: 'filter-storage',
      partialize: (state) => ({
        selectedChannels: state.selectedChannels,
        dateRange: state.dateRange,
        statType: state.statType,
        customStartDate: state.customStartDate,
        customEndDate: state.customEndDate,
        channels: state.channels,
        currentPage: state.currentPage,
      }),
    }
  )
); 