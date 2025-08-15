import { NextResponse } from "next/server";
import { z } from "zod";

const CreateRazorpayOrderSchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().positive(), // amount in INR (rupees) from client
});

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content-type" }, { status: 415 });
    }

    const payload = await request.json();
    const parsed = CreateRazorpayOrderSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
    }

    const { orderId, amount } = parsed.data;

    // In production, call Razorpay API here using RAZORPAY_KEY_ID/SECRET
    // For now, keep the mock:
    const razorpayOrder = {
      id: `order_${Date.now()}`,
      entity: "order",
      amount: Math.round(amount * 100), // paise
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency: "INR",
      receipt: orderId,
      status: "created",
      created_at: Math.floor(Date.now() / 1000),
      notes: { restaurant_order_id: orderId },
    };

    // Only expose the public key (NEVER the secret)
    const publicKey = process.env.RAZORPAY_KEY_ID || "";

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      key: publicKey,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}