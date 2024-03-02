// app/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
interface Assistant {
    id: string;
    name: string;
}

interface Thread {
    id: string;
    title: string;
}



const Page: React.FC = () => {
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [selectedAssistant, setSelectedAssistant] = useState<string>('');
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

    useEffect(() => {
        if (!selectedAssistant) {
            setThreads([]);
            return;
        }
        axios.get<Thread[]>(`/api/threads?channel=${selectedAssistant}`)
            .then(response => setThreads(response.data))
            .catch(error => console.error('Error fetching threads', error));
    }, [selectedAssistant]);

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

    return (
        <div>

            <button onClick={redirectToCreateAssistantForm}>Create Assistant</button>



            <h1>Select an Assistant</h1>
            <select onChange={e => setSelectedAssistant(e.target.value)} value={selectedAssistant}>
                <option value="">Select a Assistant</option>
                {assistants.map(assistant => (
                    <option key={assistant.id} value={assistant.id}>{assistant.name}</option>
                ))}
            </select>

            {selectedAssistant && (
                <div>
                    <h2>Select a Thread</h2>
                    <select>
                        <option value="">Select a thread</option>
                        {threads.map(thread => (
                            <option key={thread.id} value={thread.id}>{thread.title}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}

export default Page;
