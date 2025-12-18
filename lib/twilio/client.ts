import twilio from 'twilio';

// Initialize Twilio client with credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.warn('Twilio credentials not configured. Notifications will be disabled.');
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

interface SendSMSParams {
  to: string;
  message: string;
}

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

/**
 * Send SMS notification via Twilio
 */
export async function sendSMS({ to, message }: SendSMSParams) {
  if (!client || !twilioPhoneNumber) {
    console.error('Twilio not configured');
    return { success: false, error: 'Twilio not configured' };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log('SMS sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error };
  }
}

/**
 * Send email notification via Twilio SendGrid (requires SendGrid setup)
 */
export async function sendEmail({ to, subject, body }: SendEmailParams) {
  // Note: This requires Twilio SendGrid setup
  // For now, return a placeholder
  console.log('Email notification:', { to, subject, body });
  return { success: true, message: 'Email notifications require SendGrid setup' };
}

/**
 * Send notification based on user preferences (SMS and/or Email)
 */
export async function sendNotification({
  phoneNumber,
  email,
  message,
  subject,
}: {
  phoneNumber?: string;
  email?: string;
  message: string;
  subject?: string;
}) {
  const results = [];

  if (phoneNumber) {
    results.push(await sendSMS({ to: phoneNumber, message }));
  }

  if (email && subject) {
    results.push(await sendEmail({ to: email, subject, body: message }));
  }

  return results;
}
