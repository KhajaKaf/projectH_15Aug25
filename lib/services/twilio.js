import twilio from 'twilio';

let twilioClient;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

export const sendSMS = async (to, message) => {
  if (!twilioClient) {
    console.warn('⚠️ Twilio client not configured - SMS not sent');
    console.log(`📱 SMS Simulation to ${to}: ${message}`);
    return { success: true, simulation: true };
  }

  try {
    const result = await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
      body: message
    });

    console.log('✅ SMS sent successfully:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    throw new Error(`SMS sending failed: ${error.message}`);
  }
};

export const sendOrderConfirmationSMS = async (customerPhone, orderId, estimatedTime) => {
  const message = `🎉 Order Confirmed at KK's Empire!\n\nOrder #${orderId.slice(-6)} is being prepared.\nEstimated time: ${estimatedTime} minutes.\n\nThank you for dining with us!`;
  
  return await sendSMS(customerPhone, message);
};