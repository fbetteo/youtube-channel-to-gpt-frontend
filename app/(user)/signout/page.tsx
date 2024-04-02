import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import SignOutButton from '../../components/SignOutButton';

const SignOutPage: React.FC = () => {
    return (
        <Container centerContent>
            <Box w="100%" p={4}>
                <Heading mb={6}>Sign Out</Heading>
                <SignOutButton />
            </Box>
        </Container>
    );
};

export default SignOutPage;