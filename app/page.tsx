// app/page.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChakraProvider } from '@chakra-ui/react'
import { Container, Heading, Box, VStack, Text, Input, Button, Select, useToast } from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthProvider } from '../contexts/AuthContext'; // no tuve exito con esto , lo dejo ahi por ahora
import ChatBox from './components/ChatBox';
import DropdownButton from './components/UserButton';
import { create, useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import useCheckSession from './utils/useCheckSession';
import { useGlobalStore } from './store/store';
import { Assistant, Thread, Message } from './types/types';
import UserDropdownButton from './components/UserButton';

//

// interface Assistant {
//     id: string;
//     name: string;
// }

// interface Thread {
//     thread_id: string;
// }


// interface Message {
//     id: number;
//     role: string;
//     text: string; // You can expand this model based on your actual data
// }

// Sample data, replace with your data fetching logic
// const messagesData: Message[] = [
//     { id: 1, text: 'Hello there!', sender: 'User1' },
//     { id: 2, text: 'Hi, how are you?', sender: 'User2' },
//     // Add more messages for demonstration
// ];


// interface GlobalState {
//     jwtToken: string,
//     assistant: Assistant,
//     threads: Thread[],
//     thread: Thread,
//     modifyjwtToken: (jwtToken: string) => void,
//     modifyAssistant: (assistant: Assistant) => void,
//     modifyThreads: (threads: Thread[]) => void,
//     modifyThread: (thread: Thread) => void

// }

// const useGlobalStore = create<GlobalState>()(persist(
//     (set) => ({
//         jwtToken: "",
//         assistant: { id: "", name: "" },
//         threads: [{ thread_id: "" }],
//         thread: { thread_id: "" },
//         modifyjwtToken: (new_jwtToken: string) => set(() => ({ jwtToken: new_jwtToken })),
//         modifyAssistant: (new_assistant: Assistant) => set(() => ({ assistant: new_assistant })),
//         modifyThreads(threads) {
//             set(() => ({ threads: threads }))
//         },
//         modifyThread: (new_thread: Thread) => set(() => ({ thread: new_thread })),
//     }),
//     {
//         name: 'my-partial-store', // unique name for storage
//         getStorage: () => sessionStorage, // or localStorage for longer persistence
//         partialize: (state) => ({ assistant: state.assistant, threads: state.threads, thread: state.thread }), // only persist the count variable
//     }
// ));


// DUDAS
// AUTH. Estoy pasando el token como bearer y validando en el back. eso creo que ok. No estoy seguro como hacerlo para componentes que defino en otra pagina como Chatbox. Tengo que traer el jwt token alla? Lo paso como parametro como hice abajo? -> Se puede crear un interceptor que se pase el jwt en cada request. 
// Global state. Mas detalles. Estoy probando Zustang pero ni idea. No se bien como interactuar con cosas que defino en distintas paginas. Puedo pasar el setState como props como hice, pero si necesito compartir ese estado con varias cosas es mejor ver lo de zustand.
// Como mantengo estado si cambio de paginas? para que el assistant_id y los mensajes no se vayan si hago refresh. -> Persisiendo en local storage con Zustand.
// Como reacciono a mensajes enviados? Es decir, quiero que actualice los mensajes del chat una vez que clickeo send. Ahora, al clickear, la api manda el mensaje. Necesito que ademas traiga ese mensaje y luego la respuesta (que puede tardar unos segundos). Hice una funcion aca en page.tsx para que traiga todo una vez que mandas con useEffect pero suena rustico (y tengo que ver como handlear despues el futuro mensajes) -> Usar el create and poll de OpenAI todo en la funcion de mandar mensaje y que quede loading hasta que vuelve.

const Page: React.FC = () => {

    const [userId, setUserId] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);

    const [initialMount, setInitialMount] = useState<boolean>(true);

    const [assistants, setAssistants] = useState<Assistant[]>([]);
    // const [selectedAssistant, setSelectedAssistant] = useState<string>('');
    const [selectedAssistant, setSelectedAssistant] = useState({ id: '', name: '' });
    // const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedThread, setSelectedThread] = useState({ id: '' });
    const [newChat, setNewChat] = useState(false)
    const [messages, setMessages] = useState<Message[]>([]);
    // const [jwtToken, setJwtToken] = useState<string>('');

    const [messageUploaded, setMessageUploaded] = useState<boolean>(false);
    const handleUploadMessage = () => { setMessageUploaded(true); console.log(messageUploaded) };

    const router = useRouter();
    console.log(process.env.NEXT_PUBLIC_API_URL);
    const supabase = createClientComponentClient()

    const assistant_zustand = useGlobalStore(state => state.assistant)
    const thread_zustand = useGlobalStore(state => state.thread)
    const threads_zustand = useGlobalStore(state => state.threads)
    const jwtToken_zustand = useGlobalStore(state => state.jwtToken)
    const { modifyThread, modifyAssistant, modifyThreads } = useGlobalStore()
    console.log(assistant_zustand.name + "zustand")
    console.log(thread_zustand.thread_name + "zustand thread")
    console.log(selectedAssistant.name + "selected assistant name")
    console.log(selectedThread.id + "selected thread id")
    console.log(messages.length + "messages length")

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

    // function fetchSession2() {
    //     supabase.auth.getSession()
    //         .then((session) => {
    //             const jwt_token = session?.data?.session?.access_token;
    //             console.log(jwt_token + "pepepep");
    //             // if (session) {
    //             //     // User is signed in and we can access the user ID
    //             //     const jwt_token = session?.data.session.access_token;
    //             //     console.log("jwt token:", jwt_token);
    //             //     return jwt_token;
    //             // } else {
    //             //     // No user is signed in
    //             //     console.log("No user is currently signed in.");
    //             //     return null;
    //             return jwt_token;
    //         })
    //         .catch(error => console.error('Error getting the token', error));

    // }



    // useEffect(() => {
    //     supabase.auth.getSession()
    //         .then((session) => {
    //             const jwt_token = session?.data?.session?.access_token;
    //             console.log(jwt_token + "pepepep");
    //             if (!jwt_token) {
    //                 console.error("JWT token is not available.");
    //                 return;
    //             }
    //             setJwtToken(jwt_token);
    //         })
    //         .catch(error => console.error('Error getting the token', error));
    //     // Assuming you have a function `getJwtToken` that synchronously retrieves the JWT token
    // }, []);

    useCheckSession();

    useEffect(() => {
        if (!jwtToken_zustand) {
            setAssistants([]);
            return;
        }
        axios.get<Assistant[]>(process.env.NEXT_PUBLIC_API_URL + '/assistants-protected', {
            headers: { "Authorization": `Bearer ${jwtToken_zustand}` }
            // Include additional data as needed
        })
            // .then(response => console.log(response.data))
            .then((response) => {
                console.log(response.data);
                setAssistants(response.data);

            })
            // .then(console.log(assistants)
            .catch(error => console.error('Error fetching channels', error));

    }, [jwtToken_zustand]);

    useEffect(() => {
        if (assistant_zustand.name === 'Select an Assistant') {
            // setThreads([]);
            useGlobalStore.setState({ threads: [{ thread_id: "", thread_name: "" }] })
            setMessages([]);
            modifyThread({ thread_id: "", thread_name: "" })
            return;
        }
        axios.get<Thread[]>(process.env.NEXT_PUBLIC_API_URL + `/threads/${assistant_zustand.name}`, {
            headers: { "Authorization": `Bearer ${jwtToken_zustand}` }
            // Include additional data as needed
        })
            .then(response => {
                // setThreads(response.data);
                // useGlobalStore.setState({ assistant: { id: selectedAssistant.id, name: selectedAssistant.name } });
                modifyThreads(response.data)
                modifyThread({ thread_id: "", thread_name: "" })
            })
            .catch(error => console.error('Error fetching threads', error));
    }, [assistant_zustand.name, newChat, jwtToken_zustand, modifyThreads, modifyThread]);

    // useEffect(() => {
    //     if (!selectedAssistant.id) {
    //         setThreads([]);
    //         return;
    //     }
    //     axios.get<Thread[]>(process.env.NEXT_PUBLIC_API_URL + '/threads/1/' + selectedAssistant.name)
    //         .then(response => setThreads(response.data))
    //         .catch(error => console.error('Error fetching threads', error));
    // }, [selectedAssistant.id]);

    // THIS WORKS
    useEffect(() => {
        if (!thread_zustand.thread_name) {
            setMessages([]);
            return;
        }
        axios.get<Message[]>(process.env.NEXT_PUBLIC_API_URL + '/messages/' + assistant_zustand.id + '/' + thread_zustand.thread_id, {
            headers: { "Authorization": `Bearer ${jwtToken_zustand}` }
            // Include additional data as needed
        })
            .then((response) => {
                console.log(response.data);
                setMessages(response.data)
            })
            .catch(error => console.error('Error fetching messages', error));
    }, [thread_zustand.thread_id, assistant_zustand.id, jwtToken_zustand, thread_zustand.thread_name]);

    // useEffect(() => {
    //     axios.get<Message[]>(process.env.NEXT_PUBLIC_API_URL + '/messages/' + selectedAssistant.id + '/' + selectedThread.id, {
    //         headers: { "Authorization": `Bearer ${jwtToken}` }
    //         // Include additional data as needed
    //     })
    //         .then((response) => {
    //             console.log(response.data);
    //             setMessages(response.data);
    //             // add some waiting message
    //             setMessageUploaded(false);
    //         })
    //         .catch(error => console.error('Error fetching messages', error));

    // }, [messageUploaded]);

    // useEffect(() => {
    //     if (!selectedThread.id) {
    //         setMessages([]);
    //         return;
    //     }

    //     let intervalId: NodeJS.Timeout | null = null;

    //     const fetchData = async () => {
    //         axios.get<Message[]>(process.env.NEXT_PUBLIC_API_URL + '/messages/' + selectedAssistant.id + '/' + selectedThread.id, {
    //             headers: { "Authorization": `Bearer ${jwtToken}` }
    //             // Include additional data as needed
    //         })
    //             .then((response) => {
    //                 console.log(response.data);
    //                 setMessages(response.data)
    //             })
    //             .catch(error => console.error('Error fetching messages', error));
    //     };

    //     if (selectedThread) {
    //         // Start the interval only if shouldFetch is true
    //         intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    //     }

    //     return () => {
    //         if (intervalId) {
    //             clearInterval(intervalId);
    //         }
    //     };
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

    const displayAssistantName = () => {
        if (!assistant_zustand.name) {
            return "Select a channel to talk to!";
        } else if (assistant_zustand.name === "Select an Assistant") {
            return "Select a channel to talk to!";
        } else {
            return "Chatting with " + assistant_zustand.name;
        }
    };

    const redirectToCreateAssistantForm = () => {
        router.push('/createAssistant'); // Use the path to your new form page
    };

    const handleChangeAssistant = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = event.target.options.selectedIndex;
        const id = event.target.value;
        const name = event.target.options[selectedIndex].text;
        modifyAssistant({ id, name });
        // useGlobalStore.setState({ assistant: { id: id, name: name } });
        // setSelectedAssistant({ id, name });
    };

    const handleChangeThread = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = event.target.options.selectedIndex;
        const id = event.target.value;
        const name = event.target.options[selectedIndex].text;
        // useGlobalStore.setState({ thread: { thread_id: id } });
        modifyThread({ thread_id: id, thread_name: name });

        // setSelectedThread({ id });
    };

    const handleNewChat = async () => {
        const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/threads/' + assistant_zustand.name, null, {

            headers: { "Authorization": `Bearer ${jwtToken_zustand}` }
        });
        console.log('Thread created:', response.data);
        // setThreads(response.data)
        setNewChat(true)
        setMessages([]);
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
                    { }
                    <Heading>{displayAssistantName()}</Heading>
                </VStack>
            </Container>
            <div style={{ display: 'flex', flexDirection: 'row', minHeight: '25vh', alignItems: 'center', minWidth: '100vw' }}>
                {/* Sidebar with select buttons */}
                <div style={{ flex: '1' }}>
                    <Button maxW="30%" onClick={redirectToCreateAssistantForm}>Create Assistant</Button>

                    <h1>Select an Assistant</h1>
                    {/* <select onChange={e => setSelectedAssistant(e.target.value)} value={selectedAssistant}> */}
                    <Select maxW="60%" onChange={handleChangeAssistant} value={assistant_zustand.id}>
                        <option value="">Select an Assistant</option>
                        {assistants.map(assistant => (
                            <option key={assistant.id} value={assistant.id}>{assistant.name}</option>
                        ))}
                    </Select>

                    {assistant_zustand.id && (
                        <div>
                            <h2>Select a Thread</h2>
                            <Select maxW="60%" onChange={handleChangeThread} value={thread_zustand.thread_id}>
                                <option value="">Select a thread</option>
                                {threads_zustand.map(thread => (
                                    <option key={thread.thread_id} value={thread.thread_id}>{thread.thread_name}</option>
                                ))}
                            </Select>
                        </div>
                    )}

                    {assistant_zustand.id && (
                        <div>
                            <Button marginTop="20px" maxW="30%" onClick={handleNewChat} >New Chat</Button>
                        </div>
                    )}
                    {jwtToken_zustand && (
                        <UserDropdownButton marginTop="20px"></UserDropdownButton>
                    )}
                </div>


                {/* Main content in the middle */}
                <div style={{ flex: '3', textAlign: 'center' }}>
                    <Box maxW="60%" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} height="730px" display="flex" flexDirection="column">
                        <VStack flex="1" overflowY="scroll" spacing={4} align="stretch">
                            {messages?.length ? (
                                messages.map((message) => (
                                    <Box key={message.id} p={4} borderWidth="1px" borderRadius="lg">
                                        <Text>{message.role}: {message.text}</Text>
                                    </Box>
                                ))

                            ) : (
                                <Text alignSelf="center" marginTop="20px">You can start talking to the selected Youtube Channel.</Text>
                            )}
                            <div ref={endOfMessagesRef} />
                        </VStack>
                        {thread_zustand.thread_id && (
                            <ChatBox thread_id={thread_zustand.thread_id} assistant_id={assistant_zustand.id} jwtToken={jwtToken_zustand} setMessages={setMessages}></ChatBox>
                        )}
                    </Box>
                </div>

            </div>
        </ChakraProvider >
    );

}

export default Page;
