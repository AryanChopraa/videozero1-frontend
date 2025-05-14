"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../lib/store';

export default function Login() {
  const router = useRouter();
  const { login, signup, isAuthenticated, loading, error } = useAuthStore();
  
  const [isLoginModal, setIsLoginModal] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Set client-side loaded flag
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  // Redirect if authenticated
  useEffect(() => {
    if (!isClientLoaded) return;
    
    if (isAuthenticated && !loading) {
      // Check if there's a stored redirect path
      const redirectPath = 
        typeof window !== 'undefined' 
          ? sessionStorage.getItem('redirectAfterLogin') 
          : null;
      
      if (redirectPath) {
        // Clear the stored path
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else {
        // Default redirect
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, router, isClientLoaded]);

  const toggleModal = () => {
    setIsLoginModal(!isLoginModal);
    // Clear fields when toggling between login and signup
    if (isLoginModal) {
      setEmail('');
      setPassword('');
      setOrgName('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrgName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLoginModal) {
        // Login
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
        await login({ email, password });
      } else {
        // Sign up
        if (!email || !password || !orgName) {
          throw new Error('Email, password, and organization name are required');
        }
        await signup({ email, password, org_name: orgName });
      }
    } catch (e) {
      // Error handling is done in the store
      console.error(e);
    }
  };

  const handleGoogleAuth = async () => {
    // Not implementing Google auth for this example
    alert('Google authentication is not implemented in this demo');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-black">zero1intelligence</h1>
          <p className="text-sm text-gray-600 mt-1 flex items-center">
            <span className="bg-black text-white rounded px-1 mr-1">t</span> by thessis.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mt-8">
          <form onSubmit={handleSubmit}>
            {isLoginModal ? (
              <div className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 mb-4"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loading}
                    required
                  />
                  <input
                    type="password"
                    placeholder="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className={`w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : 'continue'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="organization name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 mb-4"
                    value={orgName}
                    onChange={handleOrgNameChange}
                    disabled={loading}
                    required
                  />
                  <input
                    type="email"
                    placeholder="email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 mb-4"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loading}
                    required
                  />
                  <input
                    type="password"
                    placeholder="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className={`w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : 'sign up'}
                </button>
              </div>
            )}
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">or</span>
            </div>
          </div>
          
          <button 
            className={`w-full flex items-center justify-center py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <Image 
              src="/google-logo.svg" 
              alt="Google logo" 
              width={18} 
              height={18}
              className="mr-2"
            />
            <span>{isLoginModal ? 'sign in with google' : 'sign up with google'}</span>
          </button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            {isLoginModal ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              type="button"
              onClick={toggleModal} 
              className="font-medium text-black hover:underline"
              disabled={loading}
            >
              {isLoginModal ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 