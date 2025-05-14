"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, provider?: string) => Promise<void>;
  signUp: (name: string, email: string, provider?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is logged in when the component mounts
  useEffect(() => {
    // In a real app, you would check session/token validity here
    // For now, we'll just simulate a loading state
    const checkAuth = async () => {
      setLoading(true);
      
      try {
        // Simulate API call to check authentication
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, provider?: string) => {
    setLoading(true);
    
    try {
      // Simulate API call to login
      // In a real app, you would call your authentication API here
      
      // For demo purposes, we'll just create a mock user
      const mockUser = {
        id: '1',
        name: email.split('@')[0],
        email
      };
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, provider?: string) => {
    setLoading(true);
    
    try {
      // Simulate API call to register
      // In a real app, you would call your registration API here
      
      // For demo purposes, we'll just create a mock user
      const mockUser = {
        id: '1',
        name,
        email
      };
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      // Simulate API call to logout
      // In a real app, you would call your logout API here
      
      // Remove user from local storage
      localStorage.removeItem('user');
      setUser(null);
      
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 