import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    useToast,
} from '@chakra-ui/react';
// import { supabase } from '../utils/supabaseClient'; // Ensure this path is correct
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import axios from 'axios';
import checkSession from '../utils/checkSession';
import { useGlobalStore } from '../store/store';

const SignUpForm: React.FC = () => {
    const jwtToken_zustand = useGlobalStore(state => state.jwtToken)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    // to use cookies, you need to use the createClientComponentClient function
    const supabase = createClientComponentClient() //https://supabase.com/docs/guides/auth/auth-helpers/nextjs?language=ts

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:3000/auth/callback',
            },
        });

        console.log(error + "error")

        const sessioncheck = await checkSession();
        // The order matters so it doesn't try to log jwtToken_zustand before the session check is over? Worked fine this way but if I log jwtToken_zustand before sessioncheck it's undefined!
        console.log(sessioncheck + "session check")
        console.log(jwtToken_zustand + "jwt token check")


        const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/users', {

            email: email, subscription: 'free'
        }
            // I'm using sessioncheck because I had issues with jwtToken_zustand being undefined because it took longer to update the global store. I think now it works both ways but I'm not sure.
            , { headers: { "Authorization": `Bearer ${sessioncheck}` } }
        );

        if (error || response.status !== 200) {

            toast({
                title: 'Error signing up.',
                // description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Sign up successful!',
                description: 'Please check your email to confirm your account.',
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
        <form onSubmit={handleSignUp}>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
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
                type="submit"
                isLoading={loading}
                loadingText="Signing Up"
            >
                Sign Up
            </Button>
        </form>
    );
};

export default SignUpForm;