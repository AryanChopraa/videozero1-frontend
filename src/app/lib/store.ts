import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, signup as apiSignup, getUserData, getChannels, User, AuthResponse, Channel } from './api';

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
  selectedChannel: string;
  dateRange: string;
  statType: string;
  customStartDate: string | null;
  customEndDate: string | null;
  channels: Channel[];
  isLoading: boolean;
  error: string | null;
  setSelectedChannel: (channelId: string) => void;
  setDateRange: (dateRange: string) => void;
  setStatType: (statType: string) => void;
  setCustomDateRange: (startDate: string, endDate: string) => void;
  fetchChannels: () => Promise<void>;
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
      selectedChannel: 'all',
      dateRange: 'last30days',
      statType: 'total',
      customStartDate: null,
      customEndDate: null,
      channels: [],
      isLoading: false,
      error: null,
      
      setSelectedChannel: (channelId: string) => set({ selectedChannel: channelId }),
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
      }
    }),
    {
      name: 'filter-storage',
      partialize: (state) => ({
        selectedChannel: state.selectedChannel,
        dateRange: state.dateRange,
        statType: state.statType,
        customStartDate: state.customStartDate,
        customEndDate: state.customEndDate,
        channels: state.channels,
      }),
    }
  )
); 