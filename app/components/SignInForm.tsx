'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
} from '@chakra-ui/react';
import { createBrowserClient } from "@supabase/ssr"
import { useGlobalStore } from '../store/store';
import { supabase } from '@/app/lib/supabase/client'
import { fetchUserData } from '../lib/fetchUserData';

const SignInForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const { modifySubscription, modifyEmail } = useGlobalStore.getState();


    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log("error", error)


        if (error) {
            toast({
                title: 'Error signing in.',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        } else {

            toast({
                title: 'Sign in successful!',
                description: 'You are now signed in.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            const userData = await fetchUserData()
            await new Promise(resolve => setTimeout(resolve, 2000));
            if (userData) {
                modifySubscription(userData.subscription)
                modifyEmail(userData.email)
            }
            router.push('/');
        }
        setLoading(false);



    };

    return (
        <form onSubmit={handleSignIn}>
            <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" mt={4} isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormControl>
            <Button
                mt={4}
                colorScheme="blue"
                isLoading={loading}
                type="submit"
                loadingText="Signing In"
            >
                Sign In
            </Button>
        </form>
    );
};

export default SignInForm;
