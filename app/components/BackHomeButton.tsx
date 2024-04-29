'use client'
import {
    Button
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation';


function BackHomeButton() {
    const router = useRouter();
    return (
        <Button
            colorScheme='teal'
            aria-label='Go back to home page'
            size='lg'
            leftIcon={<ArrowBackIcon />}
            onClick={() => router.push('/')}
        >Go back to home page
        </Button>
    );
}

export default BackHomeButton;