import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url(),

  DATABASE_URL: z.string().min(1),

  AUTH_JWT_SECRET: z.string().min(32),

  CLOUDINARY_URL: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  PUSHER_APP_ID: z.string().min(1),
  PUSHER_KEY: z.string().min(1),
  PUSHER_SECRET: z.string().min(1),
  PUSHER_CLUSTER: z.string().default("ap2"),
  NEXT_PUBLIC_PUSHER_KEY: z.string().min(1),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string().default("ap2"),

  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_ENV: z.enum(["sandbox", "live"]).default("sandbox"),

  PAYMENTS_DEFAULT_PROVIDER: z.enum(["razorpay","stripe","paypal"]).default("razorpay"),
  PAYMENTS_ENABLED_METHODS: z.string().default("card,netbanking,upi,paypal"),
  PAYMENTS_CURRENCY: z.string().default("INR"),
  PAYMENTS_ABSORB_FEES: z.string().default("true"),
  PAYMENTS_TIPS_ENABLED: z.string().default("true"),
  PAYMENTS_TIP_OPTIONS: z.string().default("5,10,15"),
  PAYMENTS_TEST_MODE: z.string().default("true"),

  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export const env = (() => {
  const parsed = schema.safeParse({
    ...process.env,
  });
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
})();