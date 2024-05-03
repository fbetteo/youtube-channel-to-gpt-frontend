import { v4 as uuidv4 } from 'uuid';
export interface Assistant {
    id: string;
    name: string;
}

export interface Thread {
    thread_id: string;
    thread_name: string;
}

export interface UserData {
    uuid: string;
    email: string;
    subscription: string;
    count_messages: number;
}


export interface Message {
    id: number;
    role: string;
    text: string; // You can expand this model based on your actual data
}


export interface sessionData {
    jwtToken: string;
    userData: UserData;

}