import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useGlobalStore } from '../store/store';
import axios from 'axios';
import { UserData, sessionData } from '../types/types';
import { v4 as uuidv4 } from 'uuid';


// async function checkSession(): Promise<void> {
//     const { modifyjwtToken } = useGlobalStore.getState();
//     const supabase = createClientComponentClient()

//     const result = await supabase.auth.getSession()
//         .then((session) => {
//             const jwt_token = session?.data?.session?.access_token;
//             console.log(jwt_token + "checkSession");
//             if (!jwt_token) {
//                 console.error("JWT token is not available.");
//                 return;
//             }

//         })
//         .catch(error => console.error('Error getting the token', error));





//     console.log(result + "result");
//     // Assuming you have a function `getJwtToken` that synchronously retrieves the JWT token
//     return result;
// };

async function checkSession(): Promise<sessionData | undefined> {
    const { modifyjwtToken, modifySubscription } = useGlobalStore.getState();
    const supabase = createClientComponentClient()
    try {
        const sessionResult = await supabase.auth.getSession();
        const jwt_token = sessionResult?.data?.session?.access_token;

        console.log(jwt_token + " checkSession");

        if (!jwt_token) {
            console.error("JWT token is not available.");
            return undefined;
        }

        // Perform additional actions with the JWT token
        const resource = await modifyjwtToken(jwt_token);
        console.log('Resource data:', resource);
        try {
            const subscription = await axios.get<UserData>(process.env.NEXT_PUBLIC_API_URL + '/get_user_data', {
                headers: { "Authorization": `Bearer ${jwt_token}` }
                // Include additional data as needed
            })
            modifySubscription(subscription.data.subscription)
            return { "jwtToken": resource, "userData": subscription.data };

        } catch (error) {
            console.error('User Just Signed up', error);
            const subscription = { data: { uuid: uuidv4(), email: "", subscription: "free", count_messages: 0 } }
            return { "jwtToken": resource, "userData": subscription.data };
        }


    } catch (error) {
        console.error('Error getting the token', error);
    }
}

export default checkSession;