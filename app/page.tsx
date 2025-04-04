"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Container, VStack, Text, Select, useColorModeValue, Heading, Divider, useToast, Icon, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import ChatBox from './components/ChatBox';
import { useGlobalStore } from './store/store';
import { fetchWithAuth } from './lib/fetchWithAuth';
import { FaYoutube, FaRobot, FaComments } from 'react-icons/fa';

import { Assistant, Thread, Message } from './types/types';

const Page: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const { isAuthenticated, isLoading } = useAuth();
    const isMounted = useRef(false);
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [selectedAssistant, setSelectedAssistant] = useState({ id: '', name: '' });
    const [selectedThread, setSelectedThread] = useState({ id: '' });
    const [newChat, setNewChat] = useState(false)
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageUploaded, setMessageUploaded] = useState<boolean>(false);
    const handleUploadMessage = () => { setMessageUploaded(true); console.log(messageUploaded) };
    const router = useRouter();
    const assistant_zustand = useGlobalStore(state => state.assistant)
    const thread_zustand = useGlobalStore(state => state.thread)
    const threads_zustand = useGlobalStore(state => state.threads)
    const { modifyThread, modifyAssistant, modifyThreads } = useGlobalStore()

    useEffect(() => {
        fetchWithAuth(process.env.NEXT_PUBLIC_API_URL + '/assistants-protected')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setAssistants(data);
                console.log(data + " assistants data")
            })
            .catch(error => console.error('Error fetching channels', error));
    }, []);

    useEffect(() => {
        if (isMounted.current) {
            if (assistant_zustand.name === 'Select an AI') {
                useGlobalStore.setState({ threads: [{ thread_id: "", thread_name: "" }] })
                setMessages([]);
                modifyThread({ thread_id: "", thread_name: "" })
                return;
            }
            fetchWithAuth(process.env.NEXT_PUBLIC_API_URL + `/threads/${assistant_zustand.name}`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    modifyThreads(data)
                    modifyThread({ thread_id: "", thread_name: "" })
                })
                .catch(error => console.error('Error fetching threads', error));
        } else {
            isMounted.current = true;
        }
    }, [assistant_zustand.name, modifyThreads, modifyThread]);

    useEffect(() => {
        fetchWithAuth(process.env.NEXT_PUBLIC_API_URL + `/threads/${assistant_zustand.name}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                modifyThreads(data);
            })
            .catch(error => console.error('Error fetching threads', error));
    }, [newChat, assistant_zustand.name, modifyThreads, modifyThread]);

    useEffect(() => {
        if (!thread_zustand.thread_id) {
            setMessages([]);
            return;
        }
        fetchWithAuth(process.env.NEXT_PUBLIC_API_URL + '/messages/' + assistant_zustand.id + '/' + thread_zustand.thread_id)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setMessages(data)
            })
            .catch(error => console.error('Error fetching messages', error));
    }, [thread_zustand.thread_id, assistant_zustand.id, thread_zustand.thread_name]);

    const displayAssistantName = () => {
        if (!assistant_zustand.name) {
            return <div>{"Select an AI to talk to!"}</div>
        } else if (assistant_zustand.name === "Select an AI") {
            return <div>{"Select an AI to talk to!"}</div>
        }

        return <div>{"Chatting with " + assistant_zustand.name}</div>
    };

    const redirectToCreateAssistantForm = () => {
        router.push('/createAssistant'); // Use the path to your new form page
    };

    const handleChangeAssistant = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = event.target.options.selectedIndex;
        const id = event.target.value;
        const name = event.target.options[selectedIndex].text;
        modifyAssistant({ id, name });
    };

    const handleChangeThread = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = event.target.options.selectedIndex;
        const id = event.target.value;
        const name = event.target.options[selectedIndex].text;
        modifyThread({ thread_id: id, thread_name: name });
    };

    const handleNewChat = async () => {
        try {
            const response = await fetchWithAuth(
                process.env.NEXT_PUBLIC_API_URL + '/threads/' + assistant_zustand.name,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: null
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Thread created:', data);

            setNewChat(true);
            modifyThread({ thread_id: data.thread_id, thread_name: data.thread_name });
            setMessages([]);
        } catch (error) {
            console.error('Error creating new thread:', error);
        }
    };

    function renderFirstMessage() {
        if (!assistant_zustand.id) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="red.500"
                        mt="20px"
                        textAlign="center"
                    >
                        Create or select a YouTube AI
                    </Text>
                </Box>
            );
        }
        if (assistant_zustand.id && !thread_zustand.thread_id) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color="red.500"
                        mt="20px"
                        textAlign="center"
                    >
                        Create or Select a conversation to start chatting
                    </Text>
                </Box>
            );
        }

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bg="gray.50"
                px={{ base: 4, md: 8 }}
            >
                <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="bold"
                    color="red.500"
                    mt="20px"
                    textAlign="center"
                    maxW="lg"
                >
                    You can start talking to {assistant_zustand.name}. Ask what you want, such as &quot;Create a summary of your last video.&quot;
                </Text>
            </Box>
        );
    }

    return (
        <Container maxW="container.xl" p={4}>
            <Flex direction={{ base: 'column', md: 'row' }} h="calc(100vh - 100px)" gap={4}>
                <VStack
                    w={{ base: "100%", md: "300px" }}
                    spacing={4}
                    align="stretch"
                    p={4}
                    bg={useColorModeValue('gray.50', 'gray.800')}
                    borderRadius="lg"
                    boxShadow="sm"
                >
                    {isAuthenticated ? (
                        <>
                            <Heading size="md" mb={2}>Actions</Heading>
                            <Button
                                leftIcon={<Icon as={FaRobot} />}
                                colorScheme="blue"
                                variant="solid"
                                onClick={() => router.push('/createAssistant')}
                                size="lg"
                                w="full"
                            >
                                Create Assistant
                            </Button>

                            {/* Add Assistants Selection here */}
                            <Divider my={4} />
                            <Heading size="md" mb={2}>Your AIs</Heading>
                            <Select
                                placeholder="Select an AI"
                                onChange={handleChangeAssistant}
                                value={assistant_zustand.id}
                                bg={useColorModeValue('white', 'gray.700')}
                            >
                                {assistants.map(assistant => (
                                    <option key={assistant.id} value={assistant.id}>
                                        {assistant.name}
                                    </option>
                                ))}
                            </Select>

                            {assistant_zustand.id && (
                                <>
                                    <Divider my={4} />
                                    <Heading size="md" mb={2}>Conversations</Heading>
                                    <Select
                                        placeholder="Select conversation"
                                        onChange={handleChangeThread}
                                        value={thread_zustand.thread_id}
                                        bg={useColorModeValue('white', 'gray.700')}
                                    >
                                        {threads_zustand.map(thread => (
                                            <option key={thread.thread_id} value={thread.thread_id}>
                                                {thread.thread_name}
                                            </option>
                                        ))}
                                    </Select>
                                    <Button
                                        leftIcon={<Icon as={FaComments} />}
                                        colorScheme="green"
                                        variant="outline"
                                        onClick={handleNewChat}
                                        size="md"
                                        w="full"
                                    >
                                        New Conversation
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        <VStack spacing={4}>
                            <Text fontSize="lg" textAlign="center">
                                Get started with YouTube AI
                            </Text>
                            <Button
                                colorScheme="red"
                                size="lg"
                                onClick={() => router.push('/signup')}
                                w="full"
                            >
                                Sign Up Now
                            </Button>
                        </VStack>
                    )}
                </VStack>

                <Box flex="1">
                    {thread_zustand.thread_id && assistant_zustand.id ? (
                        <ChatBox
                            thread_id={thread_zustand.thread_id}
                            assistant_id={assistant_zustand.id}
                            messages={messages}
                            setMessages={setMessages}
                        />
                    ) : (
                        <VStack
                            justify="center"
                            align="center"
                            h="100%"
                            spacing={6}
                            bg={useColorModeValue('gray.50', 'gray.800')}
                            borderRadius="lg"
                            p={8}
                        >
                            <Heading size="lg">Welcome to YouTube AI Assistant</Heading>
                            <Text fontSize="lg" textAlign="center" maxW="600px">
                                Create a YouTube AI or select an existing conversation to get started.
                            </Text>
                        </VStack>
                    )}
                </Box>
            </Flex>
        </Container>
    );
}

export default Page;
