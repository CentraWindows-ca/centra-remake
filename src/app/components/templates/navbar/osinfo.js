import os from 'os';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ username: os.userInfo().username });
}