# Deployment Guide

This project can be deployed to Vercel.

## Frontend Deployment (`apps/web`)

Deploy directly to Vercel, specifying `apps/web` as the root directory. Vercel's native Next.js support will handle the rest.

**Important for Vercel Deployment:** Due to Vercel's default `NODE_ENV=production` setting during builds, you must explicitly set the "Install Command" in your Vercel project settings for the frontend to `pnpm install --prod=false`. This ensures `devDependencies` (like `typescript`) are installed correctly.

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., `https://your-backend.vercel.app/api`)

## Backend Deployment (`apps/backend`)

Deploy to Vercel as Serverless Functions, specifying `apps/backend` as the root directory.

**Build Configuration:**
1. **Root Directory**: `apps/backend`
2. **Build Command**: `pnpm build` (or `npm run build`)
3. **Output Directory**: `dist`
4. **Install Command**: `pnpm install` (or `npm install`)

The `vercel.json` file in `apps/backend` configures the deployment to:
- Build the TypeScript code to the `dist/` directory
- Serve the compiled `dist/server.js` as a serverless function
- Route all requests to the main server file

**Environment Variables:**
Ensure all required environment variables from `.env.example` are set in your Vercel project settings:
- `PORT` (optional, Vercel sets this automatically)
- `NODE_ENV=production`
- `MONGO_URL` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `FRONTEND_URL` - Your frontend URL
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `ENCRYPTION_KEY`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`
- `GMAIL_REFRESH_TOKEN`, `FROM_EMAIL`
- And any other variables from `.env.example`