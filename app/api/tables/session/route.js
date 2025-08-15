import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { tableNumber } = await request.json();

    if (!tableNumber) {
      return NextResponse.json(
        { error: 'Table number is required' },
        { status: 400 }
      );
    }

    // Find table by number or QR code
    const table = await prisma.table.findFirst({
      where: {
        OR: [
          { number: tableNumber },
          { qrCode: tableNumber }
        ]
      }
    });

    if (!table) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
      );
    }

    if (table.status === 'MAINTENANCE') {
      return NextResponse.json(
        { error: 'Table is under maintenance' },
        { status: 400 }
      );
    }

    // Generate a session ID for this table session
    const groupId = `session_${table.id}_${Date.now()}`;

    // Set secure cookie for table session
    const cookieStore = cookies();
    cookieStore.set('table_session', JSON.stringify({
      tableId: table.id,
      groupId: groupId,
      tableNumber: table.number
    }), {
      httpOnly: true,
      //secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8 // 8 hours
    });

    // Update table status to occupied
    await prisma.table.update({
      where: { id: table.id },
      data: { status: 'OCCUPIED' }
    });

    return NextResponse.json({
      tableId: table.id,
      groupId,
      tableNumber: table.number,
      status: 'success'
    });

  } catch (error) {
    console.error('Table session error:', error);
    return NextResponse.json(
      { error: 'Failed to create table session' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('table_session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No active table session' },
        { status: 404 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    
    // Verify table still exists and is valid
    const table = await prisma.table.findUnique({
      where: { id: session.tableId }
    });

    if (!table) {
      return NextResponse.json(
        { error: 'Table session invalid' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      tableId: table.id,
      groupId: session.groupId,
      tableNumber: table.number,
      status: 'active'
    });

  } catch (error) {
    console.error('Get table session error:', error);
    return NextResponse.json(
      { error: 'Failed to get table session' },
      { status: 500 }
    );
  }
}