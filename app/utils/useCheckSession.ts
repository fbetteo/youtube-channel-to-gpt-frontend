import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useGlobalStore } from '../store/store';


const useCheckSession = () => {
    const supabase = createClientComponentClient()
    const {modifyjwtToken} = useGlobalStore();

    useEffect(() => {
        supabase.auth.getSession()
            .then((session) => {
                const jwt_token = session?.data?.session?.access_token;
                console.log(jwt_token + "pepepep");
                if (!jwt_token) {
                    console.error("JWT token is not available.");
                    return;
                }
                modifyjwtToken(jwt_token);
            })
            .catch(error => console.error('Error getting the token', error));
        // Assuming you have a function `getJwtToken` that synchronously retrieves the JWT token
    }, []);
};



const CheckSession = () => {
    const supabase = createClientComponentClient()
    const {modifyjwtToken} = useGlobalStore();

        supabase.auth.getSession()
            .then((session) => {
                const jwt_token = session?.data?.session?.access_token;
                console.log(jwt_token + "checkSession");
                if (!jwt_token) {
                    console.error("JWT token is not available.");
                    return;
                }
                modifyjwtToken(jwt_token);
            })
            .catch(error => console.error('Error getting the token', error));
        // Assuming you have a function `getJwtToken` that synchronously retrieves the JWT token
    };

export default useCheckSession;