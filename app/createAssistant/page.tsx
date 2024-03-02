'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './form.module.css'

const CreateAssistant = () => {
    const router = useRouter();
    const [channelId, setChannelId] = useState<string>('');
    const [assistantName, setAssistantName] = useState<string>('');
    const [otherField, setOtherField] = useState<string>(''); // Replace with actual field names
    // Add more state as needed for additional form fields

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await axios.post('/api/assistant', null, {
                params: {
                    channel_id: channelId,
                    assistant_name: assistantName,
                    other_field: otherField // Replace with actual data fields
                    // Include additional data as needed
                }
            });
            console.log('Assistant created:', response.data);
            router.push('/successPage'); // Redirect to a success page or another page of choice
        } catch (error) {
            console.error('Error creating assistant', error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            {/* <div className={styles.formTitle}>Create Assistant</div> */}
            <label htmlFor="channelId">Channel ID:</label>
            <input
                id="channelId"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                required
                className={styles.input}
            />

            <label htmlFor="assistantName">Assistant Name:</label>
            <input
                id="assistantName"
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                required
                className={styles.input}
            />

            <label htmlFor="otherField">Other Field:</label>
            <input
                id="otherField"
                value={otherField}
                onChange={(e) => setOtherField(e.target.value)}
                required
                className={styles.input}
            />
            {/* Include additional form fields as needed */}

            <button type="submit" className={styles.button}>Create Assistant</button>
        </form>


    );
};

export default CreateAssistant;
