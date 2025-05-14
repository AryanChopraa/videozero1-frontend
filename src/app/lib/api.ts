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

export type { User, AuthResponse, LoginParams, SignupParams, ProfileResponse }; 