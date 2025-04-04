'use client';
import React from 'react';
import { Box, Button, Flex, HStack, IconButton, useColorMode, useColorModeValue, Image, useDisclosure, VStack, Collapse } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

const Header = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onToggle } = useDisclosure();
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            position="fixed"
            top="0"
            w="100%"
            zIndex="1000"
            bg={bg}
            boxShadow="sm"
            borderBottom="1px"
            borderColor={borderColor}
        >
            <Flex
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4, md: 8 }}
                align={'center'}
                justify={'space-between'}
            >
                {/* Logo and Brand */}
                <Flex
                    flex={{ base: 1 }}
                    justify={{ base: 'start', md: 'start' }}
                    align="center"
                >
                    <Image
                        src="/logo.png"
                        alt="YouTube AI Logo"
                        h="40px"
                        cursor="pointer"
                        onClick={() => router.push('/')}
                    />
                </Flex>

                {/* Mobile menu button */}
                <Flex display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>

                {/* Desktop Navigation */}
                <HStack
                    flex={{ base: 1, md: 'auto' }}
                    justify={'flex-end'}
                    align={'center'}
                    spacing={6}
                    display={{ base: 'none', md: 'flex' }}
                >
                    <Button variant="ghost" onClick={() => router.push('/faq')}>
                        FAQ
                    </Button>
                    <Button
                        onClick={toggleColorMode}
                        variant="ghost"
                        aria-label="Toggle color mode"
                    >
                        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    </Button>
                    {!isAuthenticated ? (
                        <>
                            <Button
                                variant="outline"
                                colorScheme="blue"
                                onClick={() => router.push('/signin')}
                            >
                                Sign In
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={() => router.push('/signup')}
                            >
                                Sign Up
                            </Button>
                        </>
                    ) : (
                        <Button
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => router.push('/settings')}
                        >
                            Settings
                        </Button>
                    )}
                </HStack>
            </Flex>

            {/* Mobile Navigation */}
            <Collapse in={isOpen} animateOpacity>
                <VStack
                    p={4}
                    display={{ md: 'none' }}
                    spacing={4}
                    divider={<Box borderBottom="1px" borderColor={borderColor} w="100%" />}
                >
                    <Button w="full" variant="ghost" onClick={() => router.push('/faq')}>
                        FAQ
                    </Button>
                    <Button w="full" onClick={toggleColorMode} variant="ghost">
                        {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </Button>
                    {!isAuthenticated ? (
                        <>
                            <Button
                                w="full"
                                variant="outline"
                                colorScheme="blue"
                                onClick={() => router.push('/signin')}
                            >
                                Sign In
                            </Button>
                            <Button
                                w="full"
                                colorScheme="blue"
                                onClick={() => router.push('/signup')}
                            >
                                Sign Up
                            </Button>
                        </>
                    ) : (
                        <Button
                            w="full"
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => router.push('/settings')}
                        >
                            Settings
                        </Button>
                    )}
                </VStack>
            </Collapse>
        </Box>
    );
};

export default Header;
