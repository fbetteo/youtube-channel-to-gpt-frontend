import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useGlobalStore } from '../store/store';



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

async function checkSession(): Promise<string | undefined> {
    const { modifyjwtToken } = useGlobalStore.getState();
    const supabase = createClientComponentClient()
    try {
        const sessionResult = await supabase.auth.getSession();
        const jwt_token = sessionResult?.data?.session?.access_token;

        console.log(jwt_token + " checkSession");

        if (!jwt_token) {
            console.error("JWT token is not available.");
            return "";
        }

        // Perform additional actions with the JWT token
        const resource = await modifyjwtToken(jwt_token);
        console.log('Resource data:', resource);
        return resource

    } catch (error) {
        console.error('Error getting the token', error);
    }
}

export default checkSession;