"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogout = async () => {
    logout();
    router.push('/login');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If no user and not loading, this will be briefly shown before the redirect
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Zero1 Intelligence Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700 flex gap-2">
              <span>Welcome, {user.email}</span>
              <span className="text-gray-400">|</span>
              <span>{user.org_name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard</h2>
          <p className="text-gray-600 mb-2">
            You are logged in as <span className="font-medium">{user.email}</span>
          </p>
          <p className="text-gray-600 mb-2">
            Organization: <span className="font-medium">{user.org_name}</span>
          </p>
          <p className="text-gray-600">
            User ID: <span className="font-mono text-xs">{user.id}</span>
          </p>
        </div>
      </main>
    </div>
  );
} 