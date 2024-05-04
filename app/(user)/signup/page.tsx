'use client';
import React from 'react';
import { Box, Heading, Container } from '@chakra-ui/react';
import SignUpForm from '../../components/SignUpForm';
import BackHomeButton from '@/app/components/BackHomeButton';

const SignUpPage: React.FC = () => {
  return (

    <Container centerContent>
      <Box>
        <Heading mb={8} mt={12}>Sign Up</Heading>
        <SignUpForm />
        <BackHomeButton mt={12} />
      </Box>
    </Container>
  );
};

export default SignUpPage;
