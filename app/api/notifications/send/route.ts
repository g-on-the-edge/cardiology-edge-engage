import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendNotification } from '@/lib/twilio/client';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId, message, type } = body;

    if (!recipientId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: recipientId, message' },
        { status: 400 }
      );
    }

    // Get recipient's profile with phone number
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, phone_number, email')
      .eq('id', recipientId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // Send notification
    const results = await sendNotification({
      phoneNumber: profile.phone_number,
      email: profile.email,
      message: message,
      subject: type || 'Project Update',
    });

    // Log the notification in the database
    const { error: logError } = await supabase.from('notifications').insert({
      user_id: recipientId,
      type: type || 'general',
      message: message,
      sent_via: profile.phone_number ? 'sms' : 'email',
      status: results[0]?.success ? 'sent' : 'failed',
    });

    if (logError) {
      console.error('Error logging notification:', logError);
    }

    return NextResponse.json({
      success: true,
      results,
      recipient: profile.full_name,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
