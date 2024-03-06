'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './form.module.css'
import { useToast, Button } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'

const CreateAssistant = () => {
    const router = useRouter();
    const [channelId, setChannelId] = useState<string>('');
    const [assistantName, setAssistantName] = useState<string>('');
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false); // Loading state
    // Add more state as needed for additional form fields

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        setIsLoading(true); // Set loading state

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/assistants/1/' + assistantName, null, {
                params: {
                    channel_id: channelId
                    // Include additional data as needed
                }
            });
            console.log('Assistant created:', response.data);
            toast({
                title: 'Assistant created successfully!',
                description: "Everything looks good",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push('/');
            // Redirect to a success page or another page of choice
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
            // Handle error (e.g., show error message)
        } finally {
            setIsLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <ChakraProvider>
            // <form onSubmit={handleSubmit} className={styles.formContainer}>
                {/* <form onSubmit={handleSubmit} > */}
                {/* <div className={styles.formTitle}>Create Assistant</div> */}
                <label htmlFor="channelId">Channel ID:</label>
                <input
                    id="channelId"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    required
                    className={styles.input}
                />

                <label htmlFor="assistantName">Assistant Name:</label>
                <input
                    id="assistantName"
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    required
                    className={styles.input}
                />

                {/* Include additional form fields as needed */}
                {isLoading ? (
                    <Button isLoading loadingText="Submitting" disabled>
                        Submit
                    </Button>
                ) : (
                    <Button type="submit" colorScheme="blue">
                        Submit
                    </Button>
                )}
            </form>
        </ChakraProvider>

    );
};

export default CreateAssistant;
