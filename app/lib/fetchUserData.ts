import { supabase } from "@/app/lib/supabase/client";
import { fetchWithAuth } from "./fetchWithAuth";
import { UserData } from '../types/types';

export async function fetchUserData(): Promise<UserData | undefined> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        return undefined;
      }
      
      // Use the fetchWithAuth utility to get user data
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/get_user_data`);
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return undefined;
    }
  }