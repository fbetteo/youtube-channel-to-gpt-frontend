"use client";
import React, { useEffect, useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { fetchUserData } from '../lib/fetchUserData';

const SubscriptionButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (checkoutUrl) {
            window.location.assign(checkoutUrl);
        }
    }, [checkoutUrl]);

    const handleSubscription = async () => {
        setIsLoading(true);
        try {
            const userData = await fetchUserData();
            console.log(userData + "user data in subscription button")
            // sleep so I can see the log
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (!userData) {
                toast({
                    title: 'Error',
                    description: 'User data not found. Please log in again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const response = await fetchWithAuth(
                `/create-checkout-session`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_uuid: userData?.uuid })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            if (data.url) {
                setCheckoutUrl(data.url);
            } else {
                throw new Error('No checkout URL received');
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
            setIsLoading(false);
        }
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
