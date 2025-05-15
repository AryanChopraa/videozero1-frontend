import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, signup as apiSignup, getUserData, getChannels, getVideosByChannelId, User, AuthResponse, Channel, Video } from './api';

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
  setSelectedChannels: (channelIds: string[]) => void;
  toggleChannel: (channelId: string) => void;
  setDateRange: (dateRange: string) => void;
  setStatType: (statType: string) => void;
  setCustomDateRange: (startDate: string, endDate: string) => void;
  fetchChannels: () => Promise<void>;
  fetchVideos: (channelIds?: string[]) => Promise<void>;
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
      
      fetchVideos: async (channelIds?: string[]) => {
        const state = get();
        if (state.isLoadingVideos) return;
        
        // Use provided channelIds or fallback to selectedChannels from state
        const targetChannelIds = channelIds || state.selectedChannels;
        
        // If no channels selected, return empty array
        if (!targetChannelIds.length) {
          set({ videos: [], isLoadingVideos: false });
          return;
        }
        
        set({ isLoadingVideos: true, videoError: null });
        
        try {
          // Get videos for each selected channel and combine
          const allVideos: Video[] = [];
          
          for (const channelId of targetChannelIds) {
            // Find the channel object to get the YouTube channel_id
            const selectedChannelObj = state.channels.find(channel => channel.id === channelId);
            if (selectedChannelObj) {
              const youtubeChannelId = selectedChannelObj.channel_id;
              const channelVideos = await getVideosByChannelId(youtubeChannelId);
              allVideos.push(...channelVideos);
            }
          }
          
          set({ videos: allVideos, isLoadingVideos: false });
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
      }),
    }
  )
); 