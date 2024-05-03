"use client";
import React, { useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useGlobalStore } from '../store/store';
import checkSession from '../utils/checkSession';

const CancelSubscriptionButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const jwtToken_zustand = useGlobalStore(state => state.jwtToken)
    const [uuid, setUuid] = useState<string | undefined>(undefined);
    const modifySubscription = useGlobalStore(state => state.modifySubscription)

    const cancelSubscription = async () => {
        setIsLoading(true);
        const sessioncheck = await checkSession();
        setUuid(sessioncheck?.userData.uuid);
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/cancel-subscription', { user_uuid: uuid }, { headers: { "Authorization": `Bearer ${jwtToken_zustand}` } });

            toast({
                title: "Subscription Canceled",
                description: "Your subscription has been successfully canceled.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            modifySubscription("free")
        } catch (error) {
            toast({
                title: "Cancellation Failed",
                description: "Failed to cancel the subscription.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
        setIsLoading(false);
    };

    return (
        <Button
            colorScheme="red"
            isLoading={isLoading}
            onClick={cancelSubscription}
            disabled={isLoading}
        >
            Cancel Subscription
        </Button>
    );
}

export default CancelSubscriptionButton;
