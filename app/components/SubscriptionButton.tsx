// "use client";
// import React, { useEffect, useState } from 'react';
// import { Button, useToast } from '@chakra-ui/react';
// import axios from 'axios';
// import { useGlobalStore } from '../store/store';
// import checkSession from '../utils/checkSession';

// const SubscriptionButton = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const toast = useToast();
//     const jwtToken_zustand = useGlobalStore(state => state.jwtToken)
//     const [uuid, setUuid] = useState<string | undefined>(undefined);
//     const [checkoutUrl, setCheckoutUrl] = useState('');

//     useEffect(() => {
//         // Redirect when a valid checkout URL is set
//         if (checkoutUrl) {
//             window.location.assign(checkoutUrl);
//         }
//     }, [checkoutUrl]);

//     const handleSubscription = async () => {
//         const sessioncheck = await checkSession();
//         console.log(sessioncheck);
//         setUuid(sessioncheck?.userData.uuid);

//         useEffect(() => {
//             const createCheckoutSession = async () => {
//                 if (uuid) {

//                     console.log("uuid SUBSCTIPTION BUTTON", uuid);
//                     const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/create-checkout-session', { user_uuid: uuid }, { headers: { "Authorization": `Bearer ${jwtToken_zustand}` } });
//                     if (response.data.url) {
//                         setCheckoutUrl(response.data.url);  // Trigger redirection via useEffect
//                     } else {
//                         // Handle error (e.g., show an error message)
//                         toast({
//                             title: 'An error occurred.',
//                             description: 'Unable to create checkout session. Please try again.',
//                             status: 'error',
//                             duration: 5000,
//                             isClosable: true,
//                             position: 'top',
//                         });
//                     }
//                     setIsLoading(false);
//                 }
//             };
//             createCheckoutSession();
//         }, [uuid]);
//     };

//     return (
//         <Button
//             colorScheme="blue"
//             isLoading={isLoading}
//             onClick={handleSubscription}
//             disabled={isLoading}
//         >
//             Subscribe
//         </Button>
//     );
// }

// export default SubscriptionButton;


"use client";
import React, { useEffect, useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useGlobalStore } from '../store/store';
import checkSession from '../utils/checkSession';

const SubscriptionButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const jwtToken_zustand = useGlobalStore(state => state.jwtToken);
    const [uuid, setUuid] = useState<string | undefined>(undefined);
    const [checkoutUrl, setCheckoutUrl] = useState('');

    // This useEffect handles redirect when a valid checkout URL is set
    useEffect(() => {
        if (checkoutUrl) {
            window.location.assign(checkoutUrl);
        }
    }, [checkoutUrl]);

    // This useEffect handles creating the checkout session when uuid is updated
    useEffect(() => {
        const createCheckoutSession = async () => {
            if (uuid) {
                setIsLoading(true); // Start loading when initiating API request
                // console.log("uuid SUBSCRIPTION BUTTON", uuid);
                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`, { user_uuid: uuid }, { headers: { "Authorization": `Bearer ${jwtToken_zustand}` } });
                    if (response.data.url) {
                        setCheckoutUrl(response.data.url);  // Trigger redirection via useEffect
                    } else {
                        toast({
                            title: 'An error occurred.',
                            description: 'Unable to create checkout session. Please try again.',
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                            position: 'top',
                        });
                    }
                } catch (error) {
                    toast({
                        title: 'An error occurred.',
                        description: 'Unable to create checkout session. Please try again.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'top',
                    });
                } finally {
                    setIsLoading(false); // Stop loading whether success or fail
                }
            }
        };
        createCheckoutSession();
    }, [uuid]);

    const handleSubscription = async () => {
        setIsLoading(true); // Ensure button shows loading state immediately
        const sessionCheck = await checkSession();
        // console.log(sessionCheck);
        setUuid(sessionCheck?.userData?.uuid);
    };

    return (
        <Button
            colorScheme="blue"
            isLoading={isLoading}
            onClick={handleSubscription}
            disabled={isLoading}
        >
            Get the Gold Plan
        </Button>
    );
}

export default SubscriptionButton;
