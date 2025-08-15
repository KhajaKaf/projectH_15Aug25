import { NextRequest, NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const socketId = params.get('socket_id');
    const channelName = params.get('channel_name');

    if (!socketId || !channelName) {
      return NextResponse.json(
        { error: 'socket_id and channel_name are required' },
        { status: 400 }
      );
    }

    // For admin channels, you would check if user is admin
    if (channelName.startsWith('private-admin')) {
      // In a real app, verify admin authentication here
      // For now, we'll allow it for demo purposes
      const auth = pusherServer.authenticate(socketId, channelName);
      return NextResponse.json(auth);
    }

    // For table channels, verify table session
    if (channelName.startsWith('private-table-')) {
      const tableId = channelName.split('private-table-')[1];
      
      const cookieStore = cookies();
      const sessionCookie = cookieStore.get('table_session');

      if (!sessionCookie) {
        return NextResponse.json(
          { error: 'No table session found' },
          { status: 403 }
        );
      }

      const session = JSON.parse(sessionCookie.value);
      
      if (session.tableId !== tableId) {
        return NextResponse.json(
          { error: 'Table session mismatch' },
          { status: 403 }
        );
      }

      const auth = pusherServer.authenticate(socketId, channelName);
      return NextResponse.json(auth);
    }

    return NextResponse.json(
      { error: 'Unauthorized channel' },
      { status: 403 }
    );

  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}