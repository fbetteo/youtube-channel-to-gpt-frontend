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
import { supabase } from '../utils/supabaseClient'; // Make sure this path is correct
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useGlobalStore } from '../store/store';
const SignOutButton: React.FC = () => {
    const { modifyjwtToken, modifyAssistant, modifyThread, modifyThreads, modifySubscription } = useGlobalStore.getState();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    // to use cookies, you need to use the createClientComponentClient function
    const supabase = createClientComponentClient() //https://supabase.com/docs/guides/auth/auth-helpers/nextjs?language=ts

    const handleSignOut = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signOut();

        if (error) {
            toast({
                title: 'Error signing out.',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Sign Out successful!',
                description: 'You are now signed out.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            modifyjwtToken("")
            modifyAssistant({ id: "", name: "" })
            modifyThread({ thread_id: "", thread_name: "" })
            modifyThreads([{ thread_id: "", thread_name: "" }])
            modifySubscription("")
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <Button
            onClick={handleSignOut}
            mt={4}
            colorScheme="teal"
            isLoading={loading}
            type="submit"
            loadingText="Signing Out"
        >
            Sign Out
        </Button>
    );
};

export default SignOutButton;
