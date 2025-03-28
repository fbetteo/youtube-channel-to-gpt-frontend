import { Box, Input, Button, useToast, Text } from '@chakra-ui/react';
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
}

const ChatBox = ({ thread_id, assistant_id, setMessages }: Props) => {
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
                    `${process.env.NEXT_PUBLIC_API_URL}/messages/${assistant_id}/${thread_id}`,
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
        // Call backend to create a Stripe checkout session
        // const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/create-checkout-session', { user_uuid: uuid }, { headers: { "Authorization": `Bearer ${jwtToken}` } });

        const response = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        );
        const responseData = await response.json();
        if (responseData.data.url) {
            setCheckoutUrl(responseData.data.url);  // Trigger redirection via useEffect
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
    };

    return (
        <Box mt={4}>
            <Input
                placeholder="Type your message here..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                        handleSendClick();
                    }
                }}
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
            {/* <Modal isOpen={isModalOpen} onClose={() => { setModalOpen(false); setLoading(false); }} isCentered>
                <ModalOverlay />
                <ModalContent backgroundColor={modalBackground}>
                    <ModalHeader fontSize="lg" fontWeight="bold">Action Limit Reached</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display="flex" alignItems="center" marginBottom={4}>
                            <InfoIcon color="blue.500" w={8} h={8} mr={2} />
                            <Text fontSize="md">
                                You've reached your maximum number of free actions. Upgrade now to continue without interruption.
                            </Text>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} size="lg" onClick={handleCheckout}>
                            Subscribe Now
                        </Button>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>
                            Learn More
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal> */}
            <Modal isOpen={isModalOpen} onClose={() => { setModalOpen(false); setLoading(false); }} isCentered>
                <ModalOverlay />
                <ModalContent backgroundColor={modalBackground}>
                    <ModalHeader fontSize="lg" fontWeight="bold">Free trial finished</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display="flex" alignItems="center" marginBottom={4}>
                            <InfoIcon color="blue.500" w={8} h={8} mr={2} />
                            <Text fontSize="md">
                                You have reached your maximum number of free actions. Upgrade now to continue getting the most of Youtube without interruption.
                            </Text>
                        </Box>
                        <Box backgroundColor={useColorModeValue('blue.50', 'blue.900')} p={4} borderRadius="lg">
                            <Text fontSize="md" fontWeight="bold" mb={2}>Benefits of Subscribing:</Text>
                            <List spacing={2}>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color="green.500" />
                                    Access up to 3 different Youtube channels
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color="green.500" />
                                    Send up to 100 messages per month
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color="green.500" />
                                    Unlimited access to new features
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color="green.500" />
                                    Direct support from our team
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CheckCircleIcon} color="green.500" />
                                    Cancel anytime
                                </ListItem>
                            </List>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} size="lg" onClick={handleCheckout}>
                            Subscribe Now
                        </Button>
                        <Button variant="ghost" onClick={() => router.push("/faq")}>
                            Learn More
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ChatBox;
