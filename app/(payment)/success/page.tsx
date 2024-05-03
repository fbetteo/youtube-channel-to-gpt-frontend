import BackHomeButton from '@/app/components/BackHomeButton';
import React from 'react';

const SuccessPage: React.FC = () => {
    return (
        <div>
            <h1>Success!</h1>
            <p>Your payment was successful.</p>
            <BackHomeButton mt={40} />
        </div>
    );
};

export default SuccessPage;
