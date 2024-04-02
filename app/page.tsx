// app/page.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChakraProvider } from '@chakra-ui/react'
import { Container, Heading, Box, VStack, Text, Input, Button, Select, useToast } from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
interface Assistant {
    id: string;
    name: string;
}

interface Thread {
    thread_id: string;
}


interface Message {
    id: number;
    role: string;
    text: string; // You can expand this model based on your actual data
}

// Sample data, replace with your data fetching logic
// const messagesData: Message[] = [
//     { id: 1, text: 'Hello there!', sender: 'User1' },
//     { id: 2, text: 'Hi, how are you?', sender: 'User2' },
//     // Add more messages for demonstration
// ];






const Page: React.FC = () => {

    const [userId, setUserId] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);

    const [assistants, setAssistants] = useState<Assistant[]>([]);
    // const [selectedAssistant, setSelectedAssistant] = useState<string>('');
    const [selectedAssistant, setSelectedAssistant] = useState({ id: '', name: '' });
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThread, setSelectedThread] = useState({ id: '' });
    const [messages, setMessages] = useState<Message[]>([]);
    const [jwtToken, setJwtToken] = useState<string>('');

    const router = useRouter();
    console.log(process.env.NEXT_PUBLIC_API_URL);
    const supabase = createClientComponentClient()
    // get user_id from supabase auth

    // async function fetchUserId() {
    //     const user = supabase.auth.getUser();
    //     console.log(user);
    //     if (user) {
    //         // User is signed in and we can access the user ID
    //         const userId = (await user).data?.user?.id;
    //         console.log("User ID:", userId);
    //         return userId;
    //     } else {
    //         // No user is signed in
    //         console.log("No user is currently signed in.");
    //         return null;
    //     }
    // }


    //   function fetchSession() {
    //         const session = supabase.auth.getSession();
    //         console.log(session);
    //         if (session) {
    //             // User is signed in and we can access the user ID
    //             const jwt_token = session?.data.session.access_token;
    //             console.log("jwt token:", jwt_token);
    //             return jwt_token;
    //         } else {
    //             // No user is signed in
    //             console.log("No user is currently signed in.");
    //             return null;
    //         }
    //     }

    function fetchSession2() {
        supabase.auth.getSession()
            .then((session) => {
                const jwt_token = session?.data?.session?.access_token;
                console.log(jwt_token + "pepepep");
                // if (session) {
                //     // User is signed in and we can access the user ID
                //     const jwt_token = session?.data.session.access_token;
                //     console.log("jwt token:", jwt_token);
                //     return jwt_token;
                // } else {
                //     // No user is signed in
                //     console.log("No user is currently signed in.");
                //     return null;
                return jwt_token;
            })
            .catch(error => console.error('Error getting the token', error));

    }


    // // Example usage
    // (async () => {
    //     const userId = await fetchUserId();
    //     // if (userId) {
    //     //   // Proceed with the user ID
    //     // }
    // })();
    // (async () => {
    //     const jwt_token = await fetchSession();
    //     // if (userId) {
    //     //   // Proceed with the user ID
    //     // }
    // })();

    // axios.defaults.withCredentials = true
    // axios.get<Assistant[]>(process.env.NEXT_PUBLIC_API_URL + '/assistants-protected', {
    //     headers: { "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6Ikg2NzFncUlXdmRQZ21EeDciLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzEyMDAzNjEyLCJpYXQiOjE3MTIwMDAwMTIsImlzcyI6Imh0dHBzOi8vYWFnb3d1dmZnbXNndXdmbGV2ZHEuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjU3YWI1MDMxLWUxN2UtNDZkYi1iZjQ4LWRjOWNkZTZhZDE2MCIsImVtYWlsIjoiZnJhbmNvYmV0dGVvQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJmcmFuY29iZXR0ZW9AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjU3YWI1MDMxLWUxN2UtNDZkYi1iZjQ4LWRjOWNkZTZhZDE2MCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzEyMDAwMDEyfV0sInNlc3Npb25faWQiOiI4MTVmMjFlMC05MDJiLTRiMWMtYTY5MC1lZDUxZThkZTJlZTgiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.Pek8Xj21u7OsQSepmmB1S-KIxdoO90Q8-QXJdx30dxE` }
    //     // Include additional data as needed
    // })

    useEffect(() => {
        supabase.auth.getSession()
            .then((session) => {
                const jwt_token = session?.data?.session?.access_token;
                console.log(jwt_token + "pepepep");
                // if (session) {
                //     // User is signed in and we can access the user ID
                //     const jwt_token = session?.data.session.access_token;
                //     console.log("jwt token:", jwt_token);
                //     return jwt_token;
                // } else {
                //     // No user is signed in
                //     console.log("No user is currently signed in.");
                //     return null;
                if (!jwt_token) {
                    console.error("JWT token is not available.");
                    return;
                }
                setJwtToken(jwt_token);
            })
            .catch(error => console.error('Error getting the token', error));
        // Assuming you have a function `getJwtToken` that synchronously retrieves the JWT token
    }, []);

    useEffect(() => {
        if (!jwtToken) {
            setAssistants([]);
            return;
        }
        axios.get<Assistant[]>(process.env.NEXT_PUBLIC_API_URL + '/assistants-protected', {
            headers: { "Authorization": `Bearer ${jwtToken}` }
            // Include additional data as needed
        })
            // .then(response => console.log(response.data))
            .then((response) => {
                console.log(response.data);
                setAssistants(response.data);
            })
            // .then(console.log(assistants)
            .catch(error => console.error('Error fetching channels', error));

    }, [jwtToken]);

    useEffect(() => {
        if (!selectedAssistant) {
            setThreads([]);
            return;
        }
        axios.get<Thread[]>(`process.env.NEXT_PUBLIC_API_URL + '/threads/1/${selectedAssistant}`)
            .then(response => setThreads(response.data))
            .catch(error => console.error('Error fetching threads', error));
    }, [selectedAssistant]);

    // useEffect(() => {
    //     if (!selectedAssistant.id) {
    //         setThreads([]);
    //         return;
    //     }
    //     axios.get<Thread[]>(process.env.NEXT_PUBLIC_API_URL + '/threads/1/' + selectedAssistant.name)
    //         .then(response => setThreads(response.data))
    //         .catch(error => console.error('Error fetching threads', error));
    // }, [selectedAssistant.id]);


    // useEffect(() => {
    //     if (!selectedThread.id) {
    //         setMessages([]);
    //         return;
    //     }
    //     axios.get<Message[]>(process.env.NEXT_PUBLIC_API_URL + '/messages/1/' + selectedAssistant.name + '/' + selectedThread.id)
    //         .then((response) => {
    //             console.log(response.data);
    //             setMessages(response.data)
    //         })
    //         .catch(error => console.error('Error fetching messages', error));
    // }, [selectedThread.id]);

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

    const handleChangeAssistant = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = event.target.options.selectedIndex;
        const id = event.target.value;
        const name = event.target.options[selectedIndex].text;

        setSelectedAssistant({ id, name });
    };

    const handleChangeThread = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = event.target.options.selectedIndex;
        const id = event.target.value;
        const name = event.target.options[selectedIndex].text;

        setSelectedThread({ id });
    };

    // CHAT
    // const [messages, setMessages] = useState<Message[]>([]);
    const toast = useToast();
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     // Simulate fetching messages from backend
    //     setMessages(messagesData);
    //     scrollToBottom();
    // }, []);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Example function to handle sending new messages
    // In a real application, you would also send this to your backend
    // const sendMessage = (message: string) => {
    //     const newMessage = {
    //         id: messages.length + 1,
    //         text: message,
    //         sender: 'UserX', // Example sender, replace with actual sender data
    //     };
    //     setMessages([...messages, newMessage]);
    //     scrollToBottom();
    //     toast({
    //         title: 'Message sent.',
    //         status: 'info',
    //         duration: 2000,
    //         isClosable: true,
    //     });
    // };


    return (
        <ChakraProvider>

            <Container centerContent>
                <VStack spacing={8} mt={12}>
                    <Heading>Welcome to Our Application</Heading>
                    {/* <AuthButtons /> */}
                </VStack>
            </Container>
            <div style={{ display: 'flex', flexDirection: 'row', minHeight: '25vh', alignItems: 'center' }}>
                {/* Sidebar with select buttons */}
                <div style={{ flex: '1' }}>
                    <Button onClick={redirectToCreateAssistantForm}>Create Assistant</Button>

                    <h1>Select an Assistant</h1>
                    {/* <select onChange={e => setSelectedAssistant(e.target.value)} value={selectedAssistant}> */}
                    <Select onChange={handleChangeAssistant} value={selectedAssistant.id}>
                        <option value="">Select a Assistant</option>
                        {assistants.map(assistant => (
                            <option key={assistant.id} value={assistant.id}>{assistant.name}</option>
                        ))}
                    </Select>

                    {selectedAssistant && (
                        <div>
                            <h2>Select a Thread</h2>
                            <Select onChange={handleChangeThread} value={selectedThread.id}>
                                <option value="">Select a thread</option>
                                {threads.map(thread => (
                                    <option key={thread.thread_id} value={thread.thread_id}>{thread.thread_id}</option>
                                ))}
                            </Select>
                        </div>
                    )}
                </div>

                {/* Main content in the middle */}
                <div style={{ flex: '2', textAlign: 'center' }}>
                    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} height="500px" display="flex" flexDirection="column">
                        <VStack flex="1" overflowY="scroll" spacing={4} align="stretch">
                            {messages?.length ? (
                                messages.map((message) => (
                                    <Box key={message.id} p={4} borderWidth="1px" borderRadius="lg">
                                        <Text>{message.role}: {message.text}</Text>
                                    </Box>
                                ))

                            ) : (
                                <Text alignSelf="center" marginTop="20px">No messages yet</Text>
                            )}
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
