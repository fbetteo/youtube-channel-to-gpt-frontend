import { Box, Input, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';


interface Message {
    id: number;
    role: string;
    text: string; // You can expand this model based on your actual data
}
// somehow get the jwt in managed state ?
interface Props {
    thread_id: string;
    assistant_id: string;
    jwtToken: string;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatBox = ({ thread_id, assistant_id, jwtToken, setMessages }: Props) => {
    // State to hold the input value
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
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
        setLoading(true);


        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/messages/' + assistant_id + "/" + thread_id, null, {

                params: {
                    content: inputValue
                    // Include additional data as needed
                }, headers: { "Authorization": `Bearer ${jwtToken}` }
            });


            // Resetting input field after send
            setInputValue('');
            console.log('Message sent:', response.data);
            setMessages(response.data);


            const responseMessageCount = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/increment_user_meesages', null
                // I'm using sessioncheck because I had issues with jwtToken_zustand being undefined because it took longer to update the global store. I think now it works both ways but I'm not sure.
                , { headers: { "Authorization": `Bearer ${jwtToken}` } }
            );

            // Providing feedback to the user
            setLoading(false);
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
                isLoading={loading}
                loadingText="Answering your question..."
                onClick={() => { handleSendClick(); }}
            >
                Send
            </Button>
        </Box>
    );
};

export default ChatBox;
