export interface Assistant {
    id: string;
    name: string;
}

export interface Thread {
    thread_id: string;
}


export interface Message {
    id: number;
    role: string;
    text: string; // You can expand this model based on your actual data
}