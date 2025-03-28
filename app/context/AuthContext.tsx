'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';

// Define the shape of your context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps your app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Use your existing hook
  const authState = useAuthHook();

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}