# Deployment Guide

This project can be deployed to Vercel.

-   **Frontend (`apps/web`)**: Deploy directly to Vercel, specifying `apps/web` as the root directory. Vercel's native Next.js support will handle the rest.
    *   **Important for Vercel Deployment:** Due to Vercel's default `NODE_ENV=production` setting during builds, you must explicitly set the "Install Command" in your Vercel project settings for the frontend to `pnpm install --prod=false`. This ensures `devDependencies` (like `typescript`) are installed correctly.
-   **Backend (`apps/backend`)**: Deploy to Vercel as Serverless Functions, specifying `apps/backend` as the root directory. Ensure you have a `vercel.json` file in `apps/backend` to configure the build and routing for the API.