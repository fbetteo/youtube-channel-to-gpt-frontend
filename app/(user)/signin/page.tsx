// import { supabase } from '../../utils/supabaseClient';

// const signIn = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signInWithPassword(password);
//     if (error) throw error;
//     // Redirect user or handle success
// };

// // Add form and call signIn on form submit
import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import SignInForm from '../../components/SignInForm';
import BackHomeButton from '@/app/components/BackHomeButton';

const SignInPage: React.FC = () => {
    return (
        <Container centerContent>
            <Box w="100%" p={4}>
                <Heading mb={6} mt={12}>Sign In</Heading>
                <SignInForm />
                <BackHomeButton mt={12} />
            </Box>
        </Container>
    );
};

export default SignInPage;