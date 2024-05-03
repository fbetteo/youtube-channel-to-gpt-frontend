"use client";
import React from 'react';
import { Box, Container, Heading, VStack } from '@chakra-ui/react';
import BackHomeButton from '../../components/BackHomeButton';
import CancelSubscriptionButton from '../../components/CancelSubscriptionButton';
import { useGlobalStore } from '../../store/store';
import SubscriptionButton from '@/app/components/SubscriptionButton';

const SettingsPage: React.FC = () => {
    const subscription_zustand = useGlobalStore(state => state.subscription)
    return (
        <Container centerContent>
            {/* <Box w="100%" p={4}>
                <Heading mb={6}>Settings</Heading>
                <Heading size="md" mb={2}> Change Password </Heading>
                // add change password form here
                <Heading marginTop="40px" size="md" mb={2}> Subscription </Heading>
                // add cancel subscription form here


                <BackHomeButton></BackHomeButton>
            </Box> */}
            <VStack w="100%" p={4} spacing={10} align="start">  {/* Increased spacing and wrapped items in VStack */}
                <Heading ml={40} mb={6}>Settings</Heading>

                <Box w="100%">
                    <Heading size="md" mb={2}>Change Password</Heading>
                    {/* Placeholder for change password form */}
                </Box>

                <Box w="100%" mt={10}>
                    <Heading size="md" mb={2}>Subscription</Heading>
                    {subscription_zustand === "free" ? (
                        <SubscriptionButton />
                    ) : (
                        < CancelSubscriptionButton />
                    )}
                </Box>

                <Box pt={8} pl={1}> {/* Added padding-top directly to the BackHomeButton container */}
                    <BackHomeButton />
                </Box>
            </VStack>
        </Container>
    );
};

export default SettingsPage;