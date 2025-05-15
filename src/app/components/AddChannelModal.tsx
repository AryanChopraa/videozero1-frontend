"use client";

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Image from 'next/image';
import { getYouTubeAuthUrl } from '../lib/api';
import { useRouter } from 'next/navigation';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddChannelModal({ isOpen, onClose }: AddChannelModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  if (!isOpen) return null;
  
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const authUrl = await getYouTubeAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get YouTube auth URL', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md p-1.5"
          disabled={isLoading}
        >
          <FiX className="w-6 h-6" />
        </button>
        
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-2">Connect a YouTube Channel</h2>
          <p className="text-gray-500 mb-6 font-semibold text-sm">Connect your channel to start analysing videos and audience insights.</p>
          
          <div className="space-y-6">
            <div className="bg-[#F6F6F6] border border-gray-200 rounded-lg p-8">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-2xl">Connect via Google</h3>
              </div>
              <p className="text-gray-600 text-sm mb-36 font-semibold">Sign in with your YouTube-linked Google account for detailed analytics.</p>
              
              <button 
                className="w-full border border-gray-300 rounded-md py-4 flex items-center justify-center bg-white"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="32" height="32">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-md font-normal">sign in with google</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 