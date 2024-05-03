import BackHomeButton from '@/app/components/BackHomeButton';
import React from 'react';

const CancelPage: React.FC = () => {
    return (
        <div>
            <h1>Payment Cancelled</h1>
            <p>Your payment has been cancelled.</p>
            <BackHomeButton mt={40} />
        </div>
    );
};

export default CancelPage;