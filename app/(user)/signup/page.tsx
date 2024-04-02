'use client';
import React from 'react';
import SignUpForm from '../../components/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
