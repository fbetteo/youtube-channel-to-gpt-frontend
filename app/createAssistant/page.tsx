'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './form.module.css'
import { useToast, Button } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserClient } from '@supabase/ssr';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import BackHomeButton from '../components/BackHomeButton';
import { Tooltip, IconButton, Image } from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody } from '@chakra-ui/react';
import { fetchWithAuth } from '../lib/fetchWithAuth';

const CreateAssistant = () => {
    const router = useRouter();
    const [channelName, setChannelName] = useState<string>('');
    const [assistantName, setAssistantName] = useState<string>('');
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [jwtToken, setJwtToken] = useState<string>('');
    // Add more state as needed for additional form fields
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )


    useEffect(() => {
        supabase.auth.getSession()
            .then((session) => {
                const jwt_token = session?.data?.session?.access_token;
                // console.log(jwt_token + "pepepep");
                if (!jwt_token) {
                    console.error("JWT token is not available.");
                    return;
                }
                setJwtToken(jwt_token);
            })
            .catch(error => console.error('Error getting the token', error));
        // Assuming you have a function `getJwtToken` that synchronously retrieves the JWT token
    }, [supabase.auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        setIsLoading(true); // Set loading state

        try {
            const backendUrl = `${process.env.BACKEND_URL}/assistants/${assistantName}`;

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({
                    channel_name: channelName,
                    // Include additional data as needed
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create assistant');
            }

            const data = await response.json();
            console.log('Assistant created:', data);
            toast({
                title: 'Assistant created successfully!',
                description: "Everything looks good",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push('/');
        } catch (error) {
            console.error('Submission error:', error);
            toast({
                title: 'An error occurred.',
                description: 'Unable to submit form. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        } finally {
            setIsLoading(false); // Stop loading regardless of success or failure
        }
    };


    return (
        <AuthProvider>
            <ChakraProvider>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    {/* <form onSubmit={handleSubmit} >
                    <div className={styles.formTitle}>Create Assistant</div> */}
                    <div>
                        <strong className={styles.note}>
                            Please enter the Youtube channel name without the &apos;@&apos; symbol.
                        </strong>
                        <label htmlFor="channelName"></label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                id="channelName"
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                                required
                                placeholder="MrBeast"
                                className={styles.input}
                            />
                            <Popover>
                                <PopoverTrigger>
                                    <IconButton
                                        aria-label="Information about channel name"
                                        icon={<InfoOutlineIcon />}
                                        variant="ghost"
                                    />
                                </PopoverTrigger>
                                <PopoverContent width="auto" maxWidth="90%">
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <Image src="/mrbeast_info.png" alt="Channel name example" maxW="100%" />
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <strong className={styles.note}>
                        Please enter your Youtube AI name.
                    </strong>
                    <p>This is how you will name it for future reference</p>
                    <label htmlFor="assistantName"></label>
                    <input
                        id="assistantName"
                        value={assistantName}
                        onChange={(e) => setAssistantName(e.target.value)}
                        required
                        placeholder="MrBeast Youtube AI"
                        className={styles.input}
                    />

                    {/* Include additional form fields as needed */}
                    {isLoading ? (
                        <Button isLoading loadingText="Creating AI. This can take a minute" disabled>
                            Submit
                        </Button>
                    ) : (
                        <Button type="submit" colorScheme="blue">
                            Create AI
                        </Button>
                    )}
                    <BackHomeButton mt={100}></BackHomeButton>
                </form>
            </ChakraProvider>
        </AuthProvider>

    );
};

export default CreateAssistant;
