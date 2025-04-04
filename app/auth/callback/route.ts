import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const cookieStore = cookies()
        
        // Create a Supabase client with cookie handling
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    flowType: 'pkce',
                    autoRefreshToken: false,
                    detectSessionInUrl: false,
                    persistSession: false,
                }
            }
        )
        
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && data?.session) {
            // Set cookies manually
            cookieStore.set('supabase-auth-token', JSON.stringify([data.session.access_token, data.session.refresh_token]), {
                path: '/',
                maxAge: data.session.expires_in,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            })
        }
    }

    return NextResponse.redirect(requestUrl.origin)
}