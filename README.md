# Cardiology Edge Engage

A Next.js webapp showcasing the Edge Engage Execution Method applied to cardiology work at Gundersen Health System.

## Technology Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion for animations
- Supabase for authentication and database
- Twilio for SMS/email notifications
- Static export for Netlify deployment

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and add your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Twilio (for notifications)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

See [Twilio Setup Guide](docs/TWILIO_SETUP.md) for detailed configuration.

### 3. Set Up Database

Run the SQL schema in your Supabase SQL Editor:
```bash
supabase/schema.sql
```

### 4. Run Development Server

```bash
npm run dev
# or specify port
PORT=3001 npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser.

## Features

- 🔐 **Authentication** - Magic link login via Supabase
- 📊 **Project Management** - Track cardiology projects through 3 phases + gate review
- 📁 **File Management** - Upload and organize project assets
- 🔔 **Notifications** - SMS/email alerts via Twilio for project updates
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Scroll Animations** - Engaging Framer Motion effects

## Build for Production

```bash
npm run build
```

This creates a static export in the `out/` directory ready for Netlify deployment.

## Project Structure

Based on the Edge Engage Method V2 from edge-team-showcase, customized for cardiology-specific content and use cases.
