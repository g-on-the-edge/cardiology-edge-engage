# Cardiology Edge Engage - AI Agent Instructions

## Project Overview

**Cardiology Edge Engage** showcases the Edge Engage Execution Method applied to cardiology workflows at Gundersen Health System. It's a content-focused marketing site demonstrating healthcare workflow optimization methodology.

**Tech Stack**: Next.js 16 + React 19, TypeScript, Tailwind CSS v4, Framer Motion, Supabase Auth (optional), Netlify deployment

---

## Critical Architecture Patterns

### Next.js App Router Structure

Modern Next.js 14+ App Router with file-based routing:

- **Route Organization**:
  - `/` - Landing page
  - `/(auth)/*` - Authentication flows (route group, doesn't affect URL)
  - `/engage-method-v2` - Main methodology content
  - `/projects` - Cardiology project case studies
  - `/oauth` - OAuth callback handling
- **Parallel Routes**: Uses route groups `(auth)` for layout isolation
- **TypeScript First**: All components `.tsx`, strict type checking enabled

### Tailwind CSS v4 Configuration

Uses latest Tailwind CSS v4 with PostCSS plugin:

**Setup**:
```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**Best Practices**:
- Use utility classes for responsive design
- Custom colors defined in theme configuration
- Framer Motion for animations (not CSS transitions)
- Dark mode ready with `dark:` variants
- **Edge Brand Colors**: See `../../.github/DESIGN_SYSTEM.md` for shared design standards

### Supabase Authentication System

**Full Supabase integration** for user authentication and session management:

**Architecture**:
- **Client Setup**: `lib/supabase/client.ts` - Browser client using `@supabase/ssr`
- **Server Setup**: `lib/supabase/server.ts` - Server-side client for SSR operations
- **Middleware**: `lib/supabase/middleware.ts` - Session refresh and auth checks
- **Context Provider**: `components/providers/AuthProvider.tsx` - Global auth state

**Auth Flow**:
```tsx
// 1. Root layout wraps app in AuthProvider
// app/layout.tsx
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// 2. Use auth in components
import { useAuth } from '@/components/providers/AuthProvider';

function MyComponent() {
  const { user, session, isLoading, signOut } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <button onClick={signOut}>Sign Out</button>;
}
```

**Environment Variables Required**:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Optional Integrations**:
- **Twilio**: SMS notifications configured in `.env.local.example`
- **OAuth Callbacks**: Handled in `app/oauth/` route

### Static Site Generation

Configured for static export to Netlify:

- **Export Config**: `next.config.ts` configured for static output
- **Netlify Config**: `netlify.toml` with build settings and redirects
- **No Server-Side Routes**: All routes must be statically exportable
- **API Routes**: Must be serverless functions or client-side only

---

## Development Workflows

### Running the App

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

### Deployment to Netlify

```bash
# Build command (automatic on push)
npm run build

# Netlify configuration in netlify.toml
# - Next.js plugin handles SSG
# - Redirects configured for SPA routing
# - Environment variables set in Netlify dashboard
```

### Adding New Pages

1. Create route folder in `app/`
2. Add `page.tsx` for the route content
3. Optional: Add `layout.tsx` for route-specific layout
4. Use TypeScript and export default component

```tsx
// app/new-feature/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Feature | Cardiology Edge Engage",
  description: "Description of new feature"
};

export default function NewFeaturePage() {
  return <div>Content</div>;
}
```

---

## Code Conventions

### TypeScript Configuration

- **Strict Mode**: Enabled in `tsconfig.json`
- **Path Aliases**: `@/` maps to project root for clean imports
- **Type Safety**: All component props must be typed
- **Metadata Types**: Use Next.js `Metadata` type for SEO

### File Organization

- **app/** - Next.js App Router pages and layouts
  - `(auth)/` - Authentication pages (route group)
  - `engage-method-v2/` - Methodology content pages
  - `projects/` - Case study pages
  - `api/` - API routes (serverless functions)
- **components/** - Reusable React components
  - `providers/` - Context providers (AuthProvider)
  - Organize by feature or shared UI
- **lib/** - Utility functions, configurations
- **types/** - TypeScript type definitions
- **public/** - Static assets (images, documents)
- **docs/** - Project documentation

### Component Patterns

```tsx
// Type component props
interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

// Export as default for pages, named for components
export default function Card({ title, description, children }: CardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && <p className="text-gray-600">{description}</p>}
      {children}
    </div>
  );
}
```

### Styling Conventions

```tsx
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// Responsive design with breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Conditional classes with template literals
<button className={`px-4 py-2 rounded ${isActive ? 'bg-blue-600' : 'bg-gray-400'}`}>

// Framer Motion for animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

---

## Key Domain Concepts

### Edge Engage Execution Method

Healthcare workflow optimization methodology with key phases:

1. **Discovery** - Assess current state, identify pain points
2. **Design** - Map ideal workflows, resource allocation
3. **Deployment** - Implement changes, train staff
4. **Data** - Monitor metrics, continuous improvement

### Cardiology Use Cases

Specific applications at Gundersen Health System:

- Echo stress test workflows
- Cardiac cath lab scheduling optimization
- Heart failure clinic protocols
- Device clinic efficiency improvements

### Project Structure

Case studies organized by:
- Problem statement and baseline metrics
- Methodology application
- Results and impact metrics
- Lessons learned and scalability

---

## Common Gotchas

1. **Tailwind v4 Import**: Don't import Tailwind in CSS files. PostCSS plugin handles it automatically.

2. **Static Export Limitations**: Can't use Next.js features requiring server runtime:
   - No Server Components with dynamic data fetching
   - No Server Actions
   - No Middleware (except at build time)
   - API routes must be serverless functions

3. **Client Components**: Add `'use client'` directive when using:
   - React hooks (useState, useEffect, etc.)
   - Browser APIs (window, document)
   - Event handlers (onClick, onChange)
   - Framer Motion animations

4. **Metadata Export**: Each page needs metadata export for SEO:
   ```tsx
   export const metadata: Metadata = {
     title: "Page Title",
     description: "Page description"
   };
   ```

5. **Path Aliases**: Use `@/` for imports, not relative paths:
   ```tsx
   ✅ import { Component } from "@/components/Component"
   ❌ import { Component } from "../../components/Component"
   ```

6. **Image Optimization**: Use Next.js `<Image>` component for automatic optimization:
   ```tsx
   import Image from "next/image";
   <Image src="/logo.png" alt="Logo" width={200} height={50} />
   ```

---

## Integration Points

- **Supabase Auth**: Optional authentication for protected content
- **Framer Motion**: Animation library for UI transitions
- **Netlify**: Static hosting with form handling and serverless functions
- **Analytics**: Can integrate Google Analytics or similar in layout

---

## Reference Files for Patterns

- **App Router setup**: `app/layout.tsx`, `app/page.tsx`
- **Auth integration**: `components/providers/AuthProvider.tsx`
- **Tailwind config**: `postcss.config.mjs`, `app/globals.css`
- **TypeScript config**: `tsconfig.json`
- **Deployment**: `netlify.toml`, `next.config.ts`

---

## Quick Start for AI Agents

1. **App Router first**: Understand Next.js 14+ App Router file conventions
2. **TypeScript everywhere**: All components must be typed
3. **Tailwind utilities**: Use utility classes, avoid custom CSS unless necessary
4. **Static export**: Ensure all routes can be statically generated
5. **Client directive**: Mark components with `'use client'` when using interactivity
6. **Test locally**: Run `npm run dev` and `npm run build` to catch static export issues

When adding features, maintain static export compatibility and follow established TypeScript patterns.
