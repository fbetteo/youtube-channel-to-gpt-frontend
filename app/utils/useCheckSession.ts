import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useGlobalStore } from '../store/store';
import axios from 'axios';
import { UserData } from '../types/types';


const useCheckSession = () => {
    const supabase = createClientComponentClient()
    const {modifyjwtToken, modifySubscription, modifyEmail} = useGlobalStore();

    useEffect(() => {
        supabase.auth.getSession()
            .then(async (session) => {
                const jwt_token = session?.data?.session?.access_token;
                console.log(jwt_token + "pepepep");
                if (!jwt_token) {
                    console.error("JWT token is not available.");
                    return;
                }
                modifyjwtToken(jwt_token);

                const subscription = await axios.get<UserData>(process.env.NEXT_PUBLIC_API_URL + '/get_user_data', {
                    headers: { "Authorization": `Bearer ${jwt_token}` }
                    // Include additional data as needed
                })
                console.log(subscription.data)
                modifySubscription(subscription.data.subscription)
                modifyEmail(subscription.data.email)
            })
            .catch(error => console.error('Error getting the token', error));
        // Assuming you have a function `getJwtToken` that synchronously retrieves the JWT token
    }, [modifyjwtToken, modifySubscription, modifyEmail ]);
};



// const CheckSession = () => {
//     const supabase = createClientComponentClient()
//     const {modifyjwtToken} = useGlobalStore();

//         supabase.auth.getSession()
//             .then((session) => {
//                 const jwt_token = session?.data?.session?.access_token;
//                 console.log(jwt_token + "checkSession");
//                 if (!jwt_token) {
//                     console.error("JWT token is not available.");
//                     return;
//                 }
//                 modifyjwtToken(jwt_token);
//             })
//             .catch(error => console.error('Error getting the token', error));
//         // Assuming you have a function `getJwtToken` that synchronously retrieves the JWT token
//     };

export default useCheckSession;