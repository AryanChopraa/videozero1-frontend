import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, signup as apiSignup, User, AuthResponse } from './api';

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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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