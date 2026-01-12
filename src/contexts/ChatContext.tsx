/**
 * Chat Context
 * Global state management for authentication and real-time features
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as chatApi from '../services/chatApi';
import * as socketService from '../services/socketService';

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  isOnline: boolean;
}

interface ChatContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (username: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize - check if user is already logged in
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
          try {
            const response = await chatApi.getCurrentUser();
            if (response.success) {
              setUser(response.data.user);
              setToken(savedToken);
              // Connect socket
              socketService.connectSocket(savedToken);
            } else {
              // Invalid token
              localStorage.removeItem('token');
              setToken(null);
            }
          } catch (error) {
            console.error('Auth init error:', error);
            localStorage.removeItem('token');
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Unexpected error in auth init:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Don't disconnect socket on unmount - keep connection alive
    // Socket will only disconnect on explicit logout
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await chatApi.login(email, password);
      if (response.success) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        
        // Connect socket
        socketService.connectSocket(token);
        
        return { success: true, data: response.data };
      }
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('📝 Attempting registration:', { username, email });
      const response = await chatApi.register(username, email, password);
      console.log('📬 Registration response:', response);
      
      if (response.success) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        
        // Connect socket
        socketService.connectSocket(token);
        
        return { success: true, data: response.data };
      }
      
      // Return error message from backend
      return { 
        success: false, 
        message: response.message || response.error || 'Registration failed' 
      };
    } catch (error: any) {
      console.error('❌ Register error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    chatApi.logout();
    setUser(null);
    setToken(null);
    socketService.disconnectSocket();
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: ChatContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
