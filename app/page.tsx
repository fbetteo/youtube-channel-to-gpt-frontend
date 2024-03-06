// app/page.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChakraProvider } from '@chakra-ui/react'
import { Box, VStack, Text, Input, Button, useToast } from '@chakra-ui/react';
interface Assistant {
    id: string;
    name: string;
}

interface Thread {
    thread_id: string;
}


interface Message {
    id: number;
    text: string;
    sender: string; // You can expand this model based on your actual data
}

// Sample data, replace with your data fetching logic
const messagesData: Message[] = [
    { id: 1, text: 'Hello there!', sender: 'User1' },
    { id: 2, text: 'Hi, how are you?', sender: 'User2' },
    // Add more messages for demonstration
];



const Page: React.FC = () => {
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    // const [selectedAssistant, setSelectedAssistant] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState({ id: '', name: '' });
    const [threads, setThreads] = useState<Thread[]>([]);
    const router = useRouter();
    console.log(process.env.NEXT_PUBLIC_API_URL);


    useEffect(() => {
        axios.get<Assistant[]>(process.env.NEXT_PUBLIC_API_URL + '/assistants/1')
            // .then(response => console.log(response.data))
            .then((response) => {
                console.log(response.data);
                setAssistants(response.data);
            })
            // .then(console.log(assistants)
            .catch(error => console.error('Error fetching channels', error));

    }, []);

    // useEffect(() => {
    //     if (!selectedAssistant) {
    //         setThreads([]);
    //         return;
    //     }
    //     axios.get<Thread[]>(`process.env.NEXT_PUBLIC_API_URL + '/threads/1/${selectedAssistant}`)
    //         .then(response => setThreads(response.data))
    //         .catch(error => console.error('Error fetching threads', error));
    // }, [selectedAssistant]);

    useEffect(() => {
        if (!selectedOption.id) {
            setThreads([]);
            return;
        }
        axios.get<Thread[]>(process.env.NEXT_PUBLIC_API_URL + '/threads/1/' + selectedOption.name)
            .then(response => setThreads(response.data))
            .catch(error => console.error('Error fetching threads', error));
    }, [selectedOption.id]);

    // const handleCreateAssistant = async () => {
    //     // Replace with your API endpoint and request body as needed
    //     try {
    //         const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/assistants/1/prueba_client', null, { params: { channel_id: "UCmqincDKps3syxvD4hbODSg" } });
    //         console.log('Assistant created:', response.data);
    //         // Handle successful creation (e.g., show a message, update state)
    //     } catch (error) {
    //         console.error('Error creating assistant', error);
    //         // Handle error (e.g., show error message)
    //     }
    // };

    const redirectToCreateAssistantForm = () => {
        router.push('/createAssistant'); // Use the path to your new form page
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = event.target.options.selectedIndex;
        const id = event.target.value;
        const name = event.target.options[selectedIndex].text;

        setSelectedOption({ id, name });
    };


    // CHAT
    const [messages, setMessages] = useState<Message[]>([]);
    const toast = useToast();
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simulate fetching messages from backend
        setMessages(messagesData);
        scrollToBottom();
    }, []);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Example function to handle sending new messages
    // In a real application, you would also send this to your backend
    const sendMessage = (message: string) => {
        const newMessage = {
            id: messages.length + 1,
            text: message,
            sender: 'UserX', // Example sender, replace with actual sender data
        };
        setMessages([...messages, newMessage]);
        scrollToBottom();
        toast({
            title: 'Message sent.',
            status: 'info',
            duration: 2000,
            isClosable: true,
        });
    };


    return (
        <ChakraProvider>
            <div style={{ display: 'flex', flexDirection: 'row', minHeight: '25vh', alignItems: 'center' }}>
                {/* Sidebar with select buttons */}
                <div style={{ flex: '1' }}>
                    <button onClick={redirectToCreateAssistantForm}>Create Assistant</button>



                    <h1>Select an Assistant</h1>
                    {/* <select onChange={e => setSelectedAssistant(e.target.value)} value={selectedAssistant}> */}
                    <select onChange={handleChange} value={selectedOption.id}>
                        <option value="">Select a Assistant</option>
                        {assistants.map(assistant => (
                            <option key={assistant.id} value={assistant.id}>{assistant.name}</option>
                        ))}
                    </select>

                    {selectedOption && (
                        <div>
                            <h2>Select a Thread</h2>
                            <select>
                                <option value="">Select a thread</option>
                                {threads.map(thread => (
                                    <option key={thread.thread_id} value={thread.thread_id}>{thread.thread_id}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Main content in the middle */}
                <div style={{ flex: '2', textAlign: 'center' }}>
                    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} height="500px" display="flex" flexDirection="column">
                        <VStack flex="1" overflowY="scroll" spacing={4} align="stretch">
                            {messages.map((message) => (
                                <Box key={message.id} p={4} borderWidth="1px" borderRadius="lg">
                                    <Text>{message.sender}: {message.text}</Text>
                                </Box>
                            ))}
                            <div ref={endOfMessagesRef} />
                        </VStack>
                        <Box mt={4}>
                            {/* Implement your input and send button here */}
                            <Text>Send a message feature not implemented in this snippet.</Text>
                        </Box>
                    </Box>
                </div>

            </div>
        </ChakraProvider>
    );

}

export default Page;
