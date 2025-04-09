"use client";
import React from 'react';
import { Box, Container, Heading, VStack, useColorModeValue } from '@chakra-ui/react';
import BackHomeButton from '../../components/BackHomeButton';
import CancelSubscriptionButton from '../../components/CancelSubscriptionButton';
import { useGlobalStore } from '../../store/store';
import SubscriptionButton from '@/app/components/SubscriptionButton';

const SettingsPage: React.FC = () => {
    const subscription_zustand = useGlobalStore(state => state.subscription)

    return (
        <Container centerContent>
            <VStack w="100%" p={4} spacing={10} align="start">
                <Heading ml={40} mb={6} mt={12}>Settings</Heading>

                <Box w="100%" mt={8} pt={8} borderTop="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                    <Heading size="md" mb={4} color="red.500">Danger Zone</Heading>
                    <Box w="100%" mb={2}>
                        {subscription_zustand !== "free" && (
                            <CancelSubscriptionButton />
                        )}
                    </Box>
                </Box>

                <Box w="100%" mt={4}>
                    <Heading size="md" mb={2}>Subscription</Heading>
                    {subscription_zustand === "free" && (
                        <SubscriptionButton />
                    )}
                </Box>

                <Box pt={8} pl={1}>
                    <BackHomeButton />
                </Box>
            </VStack>
        </Container>
    );
};

export default SettingsPage;