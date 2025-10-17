# Troubleshooting Guide

This guide helps you resolve common setup and usage problems with the Discord Webhook Manager. If you encounter an issue not covered here, please check our [GitHub Issues](https://github.com/ctrixcode/discord-webhook-manager/issues) or create a new one.

## Table of Contents

- [Environment Variables](#environment-variables)
- [MongoDB Connection Issues](#mongodb-connection-issues)
- [Build and Dependency Issues](#build-and-dependency-issues)
- [Port Already in Use](#port-already-in-use)
- [Discord OAuth Setup](#discord-oauth-setup)
- [Cloudinary Configuration](#cloudinary-configuration)
- [Vercel Deployment Issues](#vercel-deployment-issues)
- [Authentication Problems](#authentication-problems)
- [File Upload Issues](#file-upload-issues)
- [Usage Limit Errors](#usage-limit-errors)
- [Need More Help?](#need-more-help)

## Environment Variables

### Problem: Environment variable not found

**Possible causes:**
- Missing `.env` file
- Incorrect environment variable names
- Environment variables not loaded properly

**Solution:**
1. **Backend Environment Variables** - Create `.env` file in `apps/backend/`:
   ```bash
   cd apps/backend
   cp .env.example .env  # If .env.example exists
   ```

   Required variables:
   ```env
   PORT=4000
   MONGO_URL=mongodb://localhost:27017/discord-webhook-manager
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ENCRYPTION_KEY=your-encryption-key-32-chars-long
   ```

2. **Frontend Environment Variables** - Create `.env` file in `apps/web/`:
   ```bash
   cd apps/web
   cp .env.example .env  # If .env.example exists
   ```

   Required variables:
   ```env
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```
   
   **Note**: The backend runs on port 4000 by default. Ensure `NEXT_PUBLIC_API_URL` includes the `/api` path.

3. **Restart your development servers** after adding environment variables.

## MongoDB Connection Issues

### Problem: ECONNREFUSED or MongoDB connection errors

**Possible causes:**
- MongoDB not running
- Wrong connection string
- Authentication failure
- Network issues

**Solution:**

1. **Check if MongoDB is running:**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

2. **Verify connection string:**
   - Local: `mongodb://localhost:27017/discord-webhook-manager`
   - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database`
   - Check for typos in username/password

3. **Test connection:**
   ```bash
   # Test MongoDB connection
   mongosh "mongodb://localhost:27017/discord-webhook-manager"
   ```

4. **Check MongoDB logs** for specific error details.

### Problem: Authentication failed

**Solution:**
- Verify username and password in connection string
- Check if user has proper permissions
- For MongoDB Atlas, ensure IP whitelist includes your IP

## Build and Dependency Issues

### Problem: Missing node_modules or dependency errors

**Possible causes:**
- Wrong Node.js version
- Package manager issues
- Corrupted dependencies

**Solution:**

1. **Check Node.js version:**
   ```bash
   node --version  # Should be >= 18
   ```

2. **Use the correct package manager (pnpm):**
   ```bash
   # Install pnpm if not installed
   npm install -g pnpm
   
   # Install dependencies
   pnpm install
   ```

3. **Clear cache and reinstall:**
   ```bash
   # Clear pnpm cache
   pnpm store prune
   
   # Remove node_modules and reinstall
   rm -rf node_modules apps/*/node_modules packages/*/node_modules
   pnpm install
   ```

4. **Build the project:**
   ```bash
   pnpm build
   ```

### Problem: TypeScript compilation errors

**Solution:**
1. **Check TypeScript version compatibility**
2. **Clear TypeScript cache:**
   ```bash
   pnpm turbo clean
   ```
3. **Rebuild:**
   ```bash
   pnpm build
   ```

### Problem: Turbo monorepo issues

**Solution:**
1. **Clear Turbo cache:**
   ```bash
   pnpm turbo clean
   ```
2. **Rebuild with fresh cache:**
   ```bash
   pnpm build
   ```

## Port Already in Use

### Problem: Port 3000 or 4000 already in use

**Possible causes:**
- Another application using the port
- Previous server instance still running

**Solution:**

1. **Find and kill the process:**
   ```bash
   # Find process using port 3000
   lsof -ti:3000
   
   # Find process using port 4000
   lsof -ti:4000
   
   # Kill the process (replace PID with actual process ID)
   kill -9 PID
   ```

2. **Use different ports:**
   ```bash
   # Backend on different port
   PORT=4001 pnpm dev
   
   # Frontend on different port
   cd apps/web && PORT=3001 pnpm dev
   ```

3. **Update environment variables** if using different ports:
   ```env
   # In apps/web/.env
   NEXT_PUBLIC_API_URL=http://localhost:4001/api
   ```

## Discord OAuth Setup

### Problem: Discord authentication not working

**Possible causes:**
- Incorrect Discord application configuration
- Wrong redirect URI
- Missing Discord credentials

**Solution:**

1. **Create Discord Application:**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create new application
   - Note Client ID and Client Secret

2. **Configure OAuth2:**
   - Go to OAuth2 → General
   - Add redirect URI: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`

3. **Update environment variables:**
   ```env
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_CLIENT_SECRET=your_client_secret
   DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

4. **Test the flow:**
   - Start both frontend and backend
   - Try logging in through Discord

## Cloudinary Configuration

### Problem: File upload failures or Cloudinary errors

**Possible causes:**
- Missing Cloudinary credentials
- Incorrect configuration
- File size limits exceeded

**Solution:**

1. **Create Cloudinary account:**
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Get your credentials from dashboard

2. **Configure environment variables:**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Check file size limits:**
   - Default limit is configured in `apps/backend/src/config/usage.ts`
   - Ensure uploaded files don't exceed limits

4. **Test upload functionality:**
   - Try uploading a small image first
   - Check browser network tab for specific errors

## Vercel Deployment Issues

### Problem: Build failures on Vercel

**Possible causes:**
- Missing environment variables
- Incorrect build configuration
- Node.js version mismatch

**Solution:**

1. **Frontend Deployment:**
   - Set "Install Command" to: `pnpm install --prod=false`
   - Add environment variables in Vercel dashboard
   - Set root directory to `apps/web`

2. **Backend Deployment:**
   - Set root directory to `apps/backend`
   - Ensure `vercel.json` exists
   - Add all required environment variables

3. **Environment Variables in Vercel:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_REDIRECT_URI=https://your-frontend-url.vercel.app/auth/callback
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ENCRYPTION_KEY=your_encryption_key
   ```

4. **Check build logs** in Vercel dashboard for specific errors.

## Authentication Problems

### Problem: "Authentication failed" or "Session expired" errors

**Possible causes:**
- Invalid JWT token
- Expired refresh token
- Missing authentication headers

**Solution:**

1. **Clear browser storage:**
   - Clear cookies and local storage
   - Try logging in again

2. **Check JWT configuration:**
   - Ensure `JWT_SECRET` is set correctly
   - Verify token expiration settings

3. **Check network requests:**
   - Ensure API calls include proper headers
   - Verify backend is running and accessible

4. **Restart development servers:**
   ```bash
   # Kill all processes and restart
   pnpm dev
   ```

## File Upload Issues

### Problem: File upload errors or "No file uploaded" messages

**Possible causes:**
- File size exceeds limits
- Unsupported file format
- Multipart form data issues

**Solution:**

1. **Check file size:**
   - Ensure files are under the configured limit
   - Check `FILE_SIZE_UPLOAD_LIMIT` in backend config

2. **Verify file format:**
   - Check supported formats in the application
   - Try with a different file format

3. **Check multipart configuration:**
   - Ensure frontend sends files as multipart/form-data
   - Verify backend multipart plugin configuration

4. **Test with smaller files first:**
   - Start with small images (< 1MB)
   - Gradually test with larger files

## Usage Limit Errors

### Problem: "Usage limit exceeded" or "WEBHOOK_LIMIT" errors

**Possible causes:**
- Exceeded webhook creation limit
- Exceeded media upload limit
- Plan restrictions

**Solution:**

1. **Check current usage:**
   - Go to Settings page in the application
   - Review your current usage statistics

2. **Upgrade plan if needed:**
   - Check available plans
   - Consider upgrading for higher limits

3. **Optimize usage:**
   - Delete unused webhooks
   - Remove old media files
   - Use templates to reduce message sending

4. **Contact support** if limits seem incorrect.

## Need More Help?

If you're still experiencing issues after following this guide:

### Community Support
- **GitHub Discussions**: [Start a discussion](https://github.com/ctrixcode/discord-webhook-manager/discussions) for general questions
- **GitHub Issues**: [Report bugs](https://github.com/ctrixcode/discord-webhook-manager/issues) for specific problems

### Issue Templates
When creating an issue, please use our templates:
- [Bug Report](https://github.com/ctrixcode/discord-webhook-manager/issues/new?template=bug_report.md)
- [Feature Request](https://github.com/ctrixcode/discord-webhook-manager/issues/new?template=feature_request.md)
- [Question](https://github.com/ctrixcode/discord-webhook-manager/issues/new?template=question.md)

### Before Creating an Issue
Please include:
1. **Environment details** (OS, Node.js version, browser)
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Error messages** (if any)
5. **Screenshots** (if applicable)

### Quick Checklist
Before asking for help, ensure you've:
- [ ] Read this troubleshooting guide
- [ ] Checked environment variables are set correctly
- [ ] Verified all services (MongoDB, Discord, Cloudinary) are configured
- [ ] Tried restarting development servers
- [ ] Cleared browser cache and cookies
- [ ] Checked the [Contributing Guide](CONTRIBUTING.md) for setup instructions

---

*This troubleshooting guide is regularly updated. If you find a solution not covered here, consider contributing to improve this documentation.*
