import { Box, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

// somehow get the jwt in managed state ?
interface Props {
    thread_id: string;
    assistant_id: string;
    jwtToken: string;
}

const ChatBox = ({ thread_id, assistant_id, jwtToken }: Props) => {
    // State to hold the input value
    const [inputValue, setInputValue] = useState('');
    // Chakra UI's toast for feedback
    const toast = useToast();
    // Function to handle input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        console.log("Input value:", event.target.value);
    };
    // Function to handle the send button click
    const handleSendClick = async () => {
        // Here, you can add the logic to process the message, like sending it to a server
        console.log("Sending message:", inputValue);
        console.log("Thread ID:", thread_id);

        // Resetting input field after send
        setInputValue('');

        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/messages/' + assistant_id + "/" + thread_id, null, {

                params: {
                    content: inputValue
                    // Include additional data as needed
                }, headers: { "Authorization": `Bearer ${jwtToken}` }
            });

            // Providing feedback to the user
            toast({
                title: 'Message sent.',
                description: "Your message has been successfully sent.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Submission error:', error);
            toast({
                title: 'An error occurred.',
                description: 'Unable to submit form. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        };
    };

    return (
        <Box mt={4}>
            <Input
                placeholder="Type your message here..."
                value={inputValue}
                onChange={handleInputChange}
            />
            <Button
                colorScheme="blue"
                mt={2}
                onClick={handleSendClick}
            >
                Send
            </Button>
        </Box>
    );
};

export default ChatBox;
