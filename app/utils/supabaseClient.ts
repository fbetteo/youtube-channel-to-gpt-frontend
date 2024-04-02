import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)


// SIGNUP
import { AuthError, User } from '@supabase/supabase-js'

// interface SignUpResponse {
//   user?: User | null;
//   error?: AuthError | null;
// }

// async function signUp(email: string, password: string): Promise<SignUpResponse> {
//   const { user, error } = await supabase.auth.signUp({ email, password })
//   return { user, error }
// }