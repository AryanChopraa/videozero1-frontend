"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store';
import Sidebar from '../components/Sidebar';
import { FiUser, FiMail, FiBriefcase, FiKey } from 'react-icons/fi';

export default function Settings() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout, fetchUserProfile } = useAuthStore();
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const profileFetched = useRef(false);

  // Handle hydration mismatch by confirming client-side rendering is complete
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  useEffect(() => {
    // Only run auth checks after client-side hydration is complete
    if (!isClientLoaded) return;

    // Don't redirect immediately if still loading
    if (loading) return;

    // Only redirect to login if we're definitely not authenticated
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      // Store the intended destination to return after login
      sessionStorage.setItem('redirectAfterLogin', '/settings');
      router.push('/login');
    } else if (!profileFetched.current) {
      // Only fetch profile once when authenticated
      profileFetched.current = true;
      console.log("Authenticated, fetching profile");
      fetchUserProfile();
    }
  }, [isAuthenticated, loading, router, fetchUserProfile, isClientLoaded]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Only show loading state if actually still loading auth
  if (!isClientLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render anything during redirect to login
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-white p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-gray-500">Manage your profile and preferences</p>
        </div>
        
        <div className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm max-w-3xl">
            <h2 className="text-xl font-semibold mb-6">User Profile</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-14 flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <FiUser className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">User ID</div>
                  <div className="text-gray-700 font-mono text-sm">{user.id}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-14 flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <FiMail className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Email Address</div>
                  <div className="text-gray-700">{user.email}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-14 flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <FiBriefcase className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Organization</div>
                  <div className="text-gray-700">{user.org_name}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 