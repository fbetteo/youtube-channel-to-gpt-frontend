'use client';
import React from 'react';
import { Box, Flex, Button, useColorModeValue, Spacer, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useGlobalStore } from '../store/store';

const Header: React.FC = () => {
    const router = useRouter();
    const bgColor = useColorModeValue('white', 'gray.800');
    const shadow = useColorModeValue('sm', 'none');
    const jwtToken = useGlobalStore(state => state.jwtToken);
    const email = useGlobalStore(state => state.email);
    const subscription = useGlobalStore(state => state.subscription);

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg={bgColor}
            color="teal.500"
            position="fixed"
            top="0"
            right="0"
            left="0"
            zIndex="1000"
            boxShadow={shadow}
        >
            <Box display={{ base: 'block', md: 'none' }} onClick={() => {/* Toggle functionality can be added here for mobile menus */ }}>
                {/* Icons or logo can be placed here */}
            </Box>

            <Spacer />

            <Box
                display="flex"
                width={{ base: 'full', md: 'auto' }}
                alignItems="center"
                flexGrow={1}
            >
                {/* Navigation or branding elements can go here */}
            </Box>

            {!jwtToken ? (

                <Box
                    display={{ base: 'none', md: 'block' }}
                    mt={{ base: 4, md: 0 }}
                >
                    <Button
                        variant="outline"
                        colorScheme="teal"
                        mr={4}
                        onClick={() => router.push('/faq')}
                    > FAQ</Button>
                    <Button
                        variant="outline"
                        colorScheme="teal"
                        mr={4}
                        onClick={() => router.push('/signin')}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant="solid"
                        colorScheme="teal"
                        onClick={() => router.push('/signup')}
                    >
                        Sign Up
                    </Button>
                </Box>
            ) : (
                <Box>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Text fontSize="lg" fontWeight="bold" color="teal.600"> Hi {email}</Text>
                        <Text fontSize="lg" fontWeight="bold" color="teal.600" ml={3}> You have a {subscription} subscription</Text>
                        <Button ml={4}
                            variant="outline"
                            colorScheme="teal"
                            mr={4}
                            onClick={() => router.push('/faq')}
                        > FAQ</Button>

                        <Button
                            // mt={4}
                            ml={4}
                            variant="solid"
                            colorScheme="teal"
                            onClick={() => router.push('/signout')}
                        >
                            Sign Out
                        </Button>
                    </Flex>
                </Box>
            )}
        </Flex>
    );
};

export default Header;
