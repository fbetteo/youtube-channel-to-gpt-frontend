"use client";
import React, { useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { fetchWithAuth } from '../lib/fetchWithAuth';
import { useGlobalStore } from '../store/store';

const CancelSubscriptionButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const { modifySubscription } = useGlobalStore();

    const handleCancelSubscription = async () => {
        setIsLoading(true);
        try {
            const response = await fetchWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/cancel-subscription`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            const data = await response.json();

            if (data.status === 'canceled') {
                modifySubscription('free');
                toast({
                    title: 'Subscription cancelled.',
                    description: 'Your subscription has been successfully cancelled.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'An error occurred.',
                description: 'Unable to cancel subscription. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            colorScheme="red"
            variant="outline"
            isLoading={isLoading}
            onClick={handleCancelSubscription}
            size="md"
        >
            Cancel Subscription
        </Button>
    );
};

export default CancelSubscriptionButton;
