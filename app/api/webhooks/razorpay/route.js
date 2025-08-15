import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Verify webhook signature from Razorpay
function verifySignature(body, signature, secret) {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  // Razorpay sends lowercase hex signature
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET ? undefined : undefined; // prevent copy-paste confusion
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    // 1) Verify signature — reject if invalid
    if (!verifySignature(rawBody, signature, razorpaySecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2) Parse JSON safely
    const payload = JSON.parse(rawBody);
    const { event, payload: eventPayload } = payload || {};

    // 3) Handle events
    if (event === "payment.captured") {
      const payment = eventPayload?.payment?.entity;
      const orderId = payment?.notes?.restaurant_order_id;

      if (orderId) {
        // TODO: Make this idempotent using a dedicated table (e.g., PaymentEvent with unique eventId)
        await prisma.order.update({
          where: { id: String(orderId) },
          data: {
            notes: `Payment captured: ${payment.id}`,
            status: "PAYMENT_PENDING", // or move to next status based on your flow
          },
        });
        console.log(`✅ Payment captured for order ${orderId}: ${payment.id}`);
      }
    }

    // You can handle more events: payment.failed, order.paid, etc.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}