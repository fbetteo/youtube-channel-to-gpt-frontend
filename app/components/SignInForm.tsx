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
// import { supabase } from '../utils/supabaseClient'; // Make sure this path is correct
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const SignInForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    // to use cookies, you need to use the createClientComponentClient function
    const supabase = createClientComponentClient() //https://supabase.com/docs/guides/auth/auth-helpers/nextjs?language=ts

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });



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
            await new Promise(resolve => setTimeout(resolve, 2000));
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
                colorScheme="teal"
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
