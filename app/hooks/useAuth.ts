import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, isLoading };
}