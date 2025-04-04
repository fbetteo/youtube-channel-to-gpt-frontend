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

            const response = await fetchWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
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
