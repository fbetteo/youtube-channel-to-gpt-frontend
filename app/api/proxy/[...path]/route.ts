import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const backendUrl = `https://youtube-channel-to-gpt.onrender.com/${params.path.join('/')}`;
    const token = req.headers.get('Authorization');

    const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
            Authorization: token || '',
        },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    const backendUrl = `https://youtube-channel-to-gpt.onrender.com/${params.path.join('/')}`;
    const token = req.headers.get('Authorization');
    const body = await req.json();

    const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token || '',
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}