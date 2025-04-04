// import { useEffect, useState } from 'react';
// import { createBrowserClient } from '@supabase/ssr';
// import { useGlobalStore } from '../store/store';
// import axios from 'axios';
// import { UserData, sessionData } from '../types/types';
// import { v4 as uuidv4 } from 'uuid';

// async function checkSession(): Promise<sessionData | undefined> {
//     const { modifyjwtToken, modifySubscription } = useGlobalStore.getState();
//     const supabase = createBrowserClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     )
//     const maxRetries = 3;
//     try {
//         const sessionResult = await supabase.auth.getSession();
//         const jwt_token = sessionResult?.data?.session?.access_token;

//         if (!jwt_token) {
//             console.error("JWT token is not available")
//             return undefined;
//         }

//         const resource = await modifyjwtToken(jwt_token);
//         try {
//             const subscription = await axios.get<UserData>(process.env.NEXT_PUBLIC_API_URL + '/get_user_data', {
//                 headers: { "Authorization": `Bearer ${jwt_token}` }
//             })
//             modifySubscription(subscription.data.subscription)
//             return { "jwtToken": resource, "userData": subscription.data };

//         } catch (error) {
//             console.error('User Just Signed up', error);
//             const subscription = { data: { uuid: uuidv4(), email: "", subscription: "free", count_messages: 0 } }
//             return { "jwtToken": resource, "userData": subscription.data };
//         }

//     } catch (error) {
//         console.error('Error getting the token', error);
//     }
// }

// export default checkSession;