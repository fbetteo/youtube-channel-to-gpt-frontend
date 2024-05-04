import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import SignOutButton from '../../components/SignOutButton';
import BackHomeButton from '@/app/components/BackHomeButton';

const SignOutPage: React.FC = () => {
    return (
        <Container centerContent>
            <Box w="100%" p={4}>
                <Heading mb={6} mt={12}>Sign Out</Heading>
                <SignOutButton />
            </Box>
            <Box w="100%" p={4}>
                <BackHomeButton mt={12} />
            </Box>
        </Container>
    );
};

export default SignOutPage;