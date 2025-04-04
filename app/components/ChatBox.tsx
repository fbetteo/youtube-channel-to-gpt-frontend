import { Box, Input, Button, useToast, Text, Flex, Container, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
// import checkSession from '../utils/checkSession';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, useColorModeValue, List,
    ListItem,
    ListIcon
} from '@chakra-ui/react';
import { InfoIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/app/lib/fetchWithAuth';
import { fetchUserData } from '@/app/lib/fetchUserData';
import ChatMessage from './ChatMessage';
import SubscriptionModal from './SubscriptionModal';

interface Message {
    id: number;
    role: string;
    text: string; // You can expand this model based on your actual data
}
// somehow get the jwt in managed state ?
interface Props {
    thread_id: string;
    assistant_id: string;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    messages: Message[]; // Add this prop
}

const ChatBox = ({ thread_id, assistant_id, setMessages, messages }: Props) => {
    // State to hold the input value
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');
    const [uuid, setUuid] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState('');
    // Chakra UI's toast for feedback
    const toast = useToast();
    const modalBackground = useColorModeValue('white', 'gray.700');

    useEffect(() => {
        // Redirect when a valid checkout URL is set
        if (checkoutUrl) {
            window.location.assign(checkoutUrl);
        }
    }, [checkoutUrl]);


    // Function to handle input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        // console.log("Input value:", event.target.value);
    };
    // Function to handle the send button click
    const handleSendClick = async () => {
        // Here, you can add the logic to process the message, like sending it to a server
        const userData = await fetchUserData();
        console.log("Sending message:", inputValue);
        console.log("Thread ID:", thread_id);
        setLoading(true);
        setUuid(userData?.uuid);



        if (userData?.subscription === 'free' && userData?.count_messages >= 3) {
            setModalOpen(true);

        }

        else {
            try {
                // const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/messages/' + assistant_id + "/" + thread_id, null, {

                //     params: {
                //         content: inputValue
                //         // Include additional data as needed
                //     }, headers: { "Authorization": `Bearer ${jwtToken}` }
                // });
                const response = await fetchWithAuth(
                    `${process.env.NEXT_PUBLIC_API_URL}/messages/${assistant_id}/${thread_id}?content=${encodeURIComponent(inputValue)}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                );

                const responseData = await response.json();
                // Resetting input field after send
                setInputValue('');
                console.log('Message sent:', responseData);
                setMessages(responseData);


                const responseMessageCount = await fetchWithAuth(
                    `${process.env.NEXT_PUBLIC_API_URL}/increment_user_messages`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    }
                );
                // const responseMessageCount = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/increment_user_messages', null
                //     // I'm using sessioncheck because I had issues with jwtToken_zustand being undefined because it took longer to update the global store. I think now it works both ways but I'm not sure.
                //     , { headers: { "Authorization": `Bearer ${jwtToken}` } }
                // );

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
    };


    const handleCheckout = async () => {
        try {
            const response = await fetchWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_uuid: uuid })
                }
            );
            const responseData = await response.json();
            console.log("Checkout response:", responseData); // Log the response to see its structure

            // Check if the URL exists in the expected structure, or alternative structures
            if (responseData?.data?.url) {
                setCheckoutUrl(responseData.data.url);
            } else if (responseData?.url) {
                setCheckoutUrl(responseData.url);
            } else {
                // Handle error (e.g., show an error message)
                toast({
                    title: 'An error occurred.',
                    description: 'Unable to create checkout session. Please try again.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast({
                title: 'An error occurred.',
                description: 'Unable to create checkout session. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        }
    };

    return (
        <Container maxW="container.xl" h="calc(100vh - 100px)" p={4}>
            <Flex direction="column" h="100%" position="relative">
                <Box
                    flex="1"
                    mb={4}
                    overflowY="auto"
                    borderRadius="md"
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    p={4}
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: useColorModeValue('gray.300', 'gray.600'),
                            borderRadius: '24px',
                        },
                    }}
                >
                    <VStack spacing={4} align="stretch">
                        {messages?.map((message) => (
                            <ChatMessage
                                key={message.id}
                                role={message.role}
                                text={message.text}
                            />
                        ))}
                    </VStack>
                </Box>

                <Box
                    position="sticky"
                    bottom={0}
                    bg={useColorModeValue('white', 'gray.800')}
                    p={4}
                    borderTopWidth="1px"
                    borderRadius="md"
                    boxShadow="sm"
                >
                    <Flex gap={2}>
                        <InputGroup size="lg">
                            <Input
                                placeholder="Type your message here..."
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' && !event.shiftKey) {
                                        handleSendClick();
                                    }
                                }}
                                pr="4.5rem"
                                bg={useColorModeValue('white', 'gray.700')}
                            />
                            <InputRightElement width="4.5rem" pr={1}>
                                <Button
                                    h="1.75rem"
                                    size="sm"
                                    colorScheme="blue"
                                    isLoading={loading}
                                    loadingText="Sending..."
                                    onClick={handleSendClick}
                                >
                                    Send
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Flex>
                </Box>
            </Flex>

            <SubscriptionModal
                isOpen={isModalOpen}
                onClose={() => { setModalOpen(false); setLoading(false); }}
                onSubscribe={handleCheckout}
                onLearnMore={() => router.push("/faq")}
            />
        </Container>
    );
};

export default ChatBox;
