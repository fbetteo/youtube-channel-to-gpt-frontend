import { UUID } from "crypto";

export interface Assistant {
    id: string;
    name: string;
}

export interface Thread {
    thread_id: string;
    thread_name: string;
}

export interface UserData {
    uuid: UUID;
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