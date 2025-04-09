import { supabase } from './supabase/client';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    // Get current session
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    // Create headers with authorization if token exists
    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Use the Next.js proxy API route
    const proxyUrl = `/api/proxy${url}`;

    return fetch(proxyUrl, {
        ...options,
        headers,
    });
  }