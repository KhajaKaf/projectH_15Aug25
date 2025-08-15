import { z } from "zod";

export const CreateOrderSchema = z.object({
  tableId: z.string().min(1),
  items: z.array(z.object({
    id: z.string().min(1),
    qty: z.number().int().positive(),
    notes: z.string().max(500).optional(),
  })).min(1),
  tip: z.number().min(0).max(100).optional(),
  paymentMethod: z.enum(["cash","razorpay","stripe","paypal"]).default("razorpay"),
});