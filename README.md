# ReeActor Frontend

Next.js frontend for ReeActor - Netflix-style platform for Patreon reaction content.

## Stack

- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **Axios** - HTTP client

## Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local

# Run development server
npm run dev
```

Visit http://localhost:3000

## Environment Variables

```bash
# API URL
NEXT_PUBLIC_API_URL=https://api.ree.actor/api/v1
```

## Deployment to Forge

### Option 1: Same Server as API

1. Add new site in Forge: `ree.actor`
2. Connect to this repository
3. Create daemon:
   - Command: `npm run start`
   - Directory: `/home/forge/ree.actor/current`
   - User: `forge`
4. Deploy

### Option 2: Cloudflare Pages (Recommended)

1. Push to GitHub
2. Connect to Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `.next`
5. Environment variable: `NEXT_PUBLIC_API_URL=https://api.ree.actor/api/v1`

Free hosting with global CDN!

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Lint code
- `npm run test` - Run tests
- `npm run type-check` - TypeScript check

## Features

- 🎬 Netflix-style grid layout
- 🔐 Patreon OAuth authentication
- 📺 Video player with progress tracking
- 🎨 Dark mode theme
- 📱 Responsive design
- ⚡ Server-side rendering
- 🔍 Full-text search
- 📊 Analytics dashboard
