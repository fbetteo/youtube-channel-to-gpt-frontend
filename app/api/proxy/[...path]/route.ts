import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const backendUrl = `${process.env.BACKEND_URL}/${params.path.join('/')}`;
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
    const backendUrl = `${process.env.BACKEND_URL}/${params.path.join('/')}`;
    const token = req.headers.get('Authorization');

    let body = null;
    try {
        // Attempt to parse the body only if it exists
        if (req.body) {
            body = await req.json();
        }
    } catch (error) {
        console.error('Error parsing request body:', error);
    }

    const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token || '',
        },
        body: body ? JSON.stringify(body) : undefined, // Only include body if it exists
    });

    let data;
    try {
        data = await response.json();
    } catch (error) {
        console.error('Error parsing response body:', error);
        data = { error: 'Invalid JSON response from backend' };
    }

    return NextResponse.json(data, { status: response.status });
}