# Twilio Integration Setup Guide

## Overview
Twilio is integrated to send SMS notifications for project updates, file uploads, phase completions, and team assignments.

## Setup Steps

### 1. Twilio Console Setup
1. Go to https://console.twilio.com
2. Navigate to **Phone Numbers** → **Manage** → **Buy a number**
3. Purchase a phone number with SMS capabilities
4. Copy your credentials:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click eye icon to reveal)
   - **Phone Number** (format: +1234567890)

### 2. Environment Variables
Add these to your `.env.local` file:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

For Netlify deployment, add these same variables in:
**Netlify Dashboard** → **Site Settings** → **Environment Variables**

### 3. Database Setup
Run the updated `supabase/schema.sql` in your Supabase SQL Editor to add:
- `notifications` table - tracks sent notifications
- `notification_preferences` table - user notification settings
- `phone_number` field in `users` table

### 4. Testing Notifications

#### Test via API Route
```bash
curl -X POST http://localhost:3001/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "user-uuid-here",
    "message": "Test notification from Cardiology Edge Engage",
    "type": "general"
  }'
```

#### Test via Helper Functions
```typescript
import { notifyFileUploaded } from '@/lib/notifications/helpers';

await notifyFileUploaded({
  recipientId: 'user-uuid',
  projectName: 'Cardiology Workflow Redesign',
  assetName: 'Patient Flow Diagram.pdf',
  userName: 'Dr. Smith'
});
```

## Usage in Components

### Example: Notify on File Upload
```typescript
// In your file upload component
import { notifyFileUploaded } from '@/lib/notifications/helpers';

const handleUpload = async (file: File) => {
  // ... upload logic ...
  
  // Notify project team members
  await notifyFileUploaded({
    recipientId: projectOwnerId,
    projectName: project.name,
    assetName: file.name,
    userName: currentUser.full_name
  });
};
```

### Example: Notify on Phase Completion
```typescript
import { notifyPhaseCompleted } from '@/lib/notifications/helpers';

const completePhase = async (phase: number) => {
  // ... completion logic ...
  
  await notifyPhaseCompleted({
    recipientId: projectSponsorId,
    projectName: 'Cardiology Innovation',
    phaseName: `Phase ${phase}`
  });
};
```

## Available Notification Helpers

Located in `/lib/notifications/helpers.ts`:

- `notifyFileUploaded()` - When files are uploaded
- `notifyPhaseCompleted()` - When project phases complete
- `notifyProjectAssignment()` - When users assigned to projects
- `notifyGatePassed()` - When gate reviews are approved
- `notifyTeam()` - Send to multiple recipients

## User Phone Number Setup

Users need to add their phone number to their profile:
1. Navigate to user profile/settings
2. Add phone number field (format: +1234567890)
3. Save to enable SMS notifications

## Twilio Costs
- SMS messages: ~$0.0079 per message (US)
- Phone number: ~$1.15/month
- Free trial includes $15 credit

## Troubleshooting

### Notifications not sending
1. Check Twilio credentials in `.env.local`
2. Verify phone number format includes country code (+1)
3. Check Twilio console for error logs
4. Ensure user has phone number in database

### "Twilio not configured" error
- Restart dev server after adding environment variables
- Verify all three variables are set (SID, TOKEN, PHONE)

### SMS not received
- Check Twilio console message logs
- Verify recipient phone number is valid
- For trial accounts, verify recipient is verified in Twilio

## Next Steps
1. Add phone number field to user profile UI
2. Create notification preferences page
3. Add in-app notification center (optional)
4. Set up webhook for delivery status (optional)
