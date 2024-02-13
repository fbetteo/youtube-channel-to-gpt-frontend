import { NextApiRequest, NextApiResponse } from 'next';

interface Thread {
    id: string;
    title: string;
}

const threads: { [key: string]: Thread[] } = {
    '1': [
        { id: '101', title: 'Thread 1 in Channel 1' },
        { id: '102', title: 'Thread 2 in Channel 1' },
        // ... more threads for channel 1
    ],
    '2': [
        { id: '201', title: 'Thread 1 in Channel 2' },
        { id: '202', title: 'Thread 2 in Channel 2' },
        // ... more threads for channel 2
    ]
    // ... more channels and their threads
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { channel } = req.query;
    res.status(200).json(threads[channel as string] || []);
}