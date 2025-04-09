// import { useEffect } from 'react';
// import { createBrowserClient } from '@supabase/ssr';
// import { useGlobalStore } from '../store/store';
// import axios from 'axios';
// import { UserData } from '../types/types';


// const useCheckSession = () => {
//     const supabase = createBrowserClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     )
//     const {jwtToken, modifyjwtToken, modifySubscription, modifyEmail} = useGlobalStore();

//     useEffect(() => {
//         supabase.auth.getSession()
//             .then(async (session) => {
//                 const jwt_token = session?.data?.session?.access_token;
//                 // console.log(jwt_token + "pepepep USE EFFECT");
//                 if (!jwt_token) {
//                     console.error("JWT token is not available.");
//                     return;
//                 }
//                 modifyjwtToken(jwt_token);

//                 try {

//                     const subscription = await axios.get<UserData>(process.env.NEXT_PUBLIC_API_URL + '/get_user_data', {
//                         headers: { "Authorization": `Bearer ${jwt_token}` }
//                         // Include additional data as needed
//                     })
//                     // console.log(subscription.data)
//                     // console.log("USE EFFECT CHECK SESSion")
//                     modifySubscription(subscription.data.subscription)
//                     modifyEmail(subscription.data.email)

//                 }
//                 catch (error) {
//                     console.error('Error getting the token', error);
//                     const base64Url = jwt_token.split('.')[1]; // Get the payload part
//                     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//                     const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
//                         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//                     }).join(''));
//                     // const subscription = await axios.get<UserData>(process.env.NEXT_PUBLIC_API_URL + '/get_user_data', {
//                     //     headers: { "Authorization": `Bearer ${jwt_token}` }
//                     // })
//                     const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/users', {

//                         email: JSON.parse(jsonPayload).email,
//                         subscription: 'free'
//                     }
//                         // I'm using sessioncheck because I had issues with jwtToken_zustand being undefined because it took longer to update the global store. I think now it works both ways but I'm not sure.
//                         , { headers: { "Authorization": `Bearer ${jwtToken}` } }
//                     );
//                     modifySubscription('free')
//                     modifyEmail(JSON.parse(jsonPayload).email)

//                 }
            
//                 }
//             )
//                 .catch(error => console.error('Error getting the token', error));
//         // Assuming you have a function `getJwtToken` that synchronously retrieves the JWT token
//     }, [jwtToken, modifyjwtToken, modifySubscription, modifyEmail ]);
// };

// export default useCheckSession;