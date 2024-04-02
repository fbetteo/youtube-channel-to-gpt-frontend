import React from 'react';
import { Button, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const AuthButtons: React.FC = () => {
    const router = useRouter();

    return (
        <Stack direction="row" spacing={4}>
            <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => router.push('/signin')}
            >
                Sign In
            </Button>
            <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => router.push('/signup')}
            >
                Sign Up
            </Button>
        </Stack>
    );
};

export default AuthButtons;
