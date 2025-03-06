import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner'; // Assuming you're using sonner for notifications

const AUTH_BASE_URL = "http://localhost:8000/authentication";

const GoogleAccountIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check existing Google account connection on component mount
  useEffect(() => {
    checkGoogleConnection();
  }, []);

  const checkGoogleConnection = async () => {
    try {
      const response = await axios.get(`${AUTH_BASE_URL}/google-credentials/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setIsConnected(true);
      setConnectedEmail(response.data.email);
    } catch (error) {
      setIsConnected(false);
      setConnectedEmail(null);
    }
  };

  const initiateGoogleOAuth = async () => {
    setIsLoading(true);
    try {
      // Get authorization URL from backend
      const response = await axios.get(`${AUTH_BASE_URL}/google-oauth/initiate/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      // Redirect to Google OAuth consent screen
      window.location.href = response.data.authorization_url;
    } catch (error) {
      toast.error('Failed to initiate Google OAuth');
      setIsLoading(false);
      console.error('OAuth initiation error:', error);
    }
  };

  const handleGoogleOAuthCallback = async (code: string, state: string) => {
    try {
      const response = await axios.post(`${AUTH_BASE_URL}/google-oauth/complete/`, 
        { code, state },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      toast.success('Google account linked successfully');
      setIsConnected(true);
      setConnectedEmail(response.data.email);
    } catch (error) {
      toast.error('Failed to complete Google OAuth');
      console.error('OAuth completion error:', error);
    }
  };

  const unlinkGoogleAccount = async () => {
    try {
      await axios.delete(`${AUTH_BASE_URL}/google-credentials/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      toast.success('Google account unlinked');
      setIsConnected(false);
      setConnectedEmail(null);
    } catch (error) {
      toast.error('Failed to unlink Google account');
      console.error('Unlinking error:', error);
    }
  };

  // Handle OAuth callback when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      handleGoogleOAuthCallback(code, state);
      // Remove query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900">Google Account</p>
        {isConnected && connectedEmail ? (
          <p className="text-sm text-gray-500">
            Connected with: {connectedEmail}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Connect your Google account for enhanced features
          </p>
        )}
      </div>
      {isConnected ? (
        <button
          onClick={unlinkGoogleAccount}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
        >
          Unlink
        </button>
      ) : (
        <button
          onClick={initiateGoogleOAuth}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Connecting...' : 'Connect'}
        </button>
      )}
    </div>
  );
};

export default GoogleAccountIntegration;