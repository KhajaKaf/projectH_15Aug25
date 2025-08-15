import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
//import { pusherServer } from '@/lib/pusher';
import { pusherServer, toPublicOrder } from "@/lib/pusher";
import { sendOrderConfirmationSMS } from '@/lib/services/twilio';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status, etaMinutes, notes } = await request.json();

    // Validate status
    const validStatuses = ['NEW', 'CONFIRMED', 'IN_PROGRESS', 'READY', 'SERVED', 'CANCELLED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
      include: { table: true }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: status,
        estimatedTime: etaMinutes || order.estimatedTime,
        notes: notes || order.notes
      },
      include: {
        table: true,
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    // Create order event for audit trail
    await prisma.orderEvent.create({
      data: {
        orderId: id,
        status: status,
        notes: notes || `Status updated to ${status}`,
        createdBy: 'manager' // In a real app, this would be the authenticated user
      }
    });

    // Send SMS notification if order is confirmed
    if (status === 'CONFIRMED' && order.customerPhone && etaMinutes) {
      try {
        await sendOrderConfirmationSMS(order.customerPhone, order.id, etaMinutes);
        console.log('✅ SMS confirmation sent successfully');
      } catch (smsError) {
        console.error('❌ SMS sending failed:', smsError);
        // Don't fail the status update if SMS fails
      }
    }

    // Send real-time notifications
    try {
      const eventData = {
        orderId: updatedOrder.id,
        status: updatedOrder.status,
        estimatedTime: updatedOrder.estimatedTime,
        notes: updatedOrder.notes,
        tableNumber: updatedOrder.table.number,
        timestamp: new Date()
      };

      // Notify admin dashboard
      //await pusherServer.trigger('private-admin', 'order-status-updated', eventData);
      await pusherServer.trigger('public-orders', 'order.updated', toPublicOrder(order));

      // Notify table
      await pusherServer.trigger(`private-table-${updatedOrder.tableId}`, 'order-status-updated', eventData);
    } catch (pusherError) {
      console.error('Pusher notification failed:', pusherError);
      // Don't fail the status update if pusher fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        estimatedTime: updatedOrder.estimatedTime,
        notes: updatedOrder.notes,
        tableNumber: updatedOrder.table.number
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}