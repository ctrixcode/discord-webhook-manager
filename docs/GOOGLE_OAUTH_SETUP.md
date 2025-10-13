# Google OAuth Setup Guide

This guide covers setting up Google OAuth for **both** Gmail API (sending emails) and user authentication using a **single OAuth client** for simplicity.

---

## Prerequisites

- A Google Cloud Platform account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

---

## Step 1: Create/Select a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project" or select your existing project
4. Name it (e.g., "Discord Webhook Manager")

## Step 2: Enable Required APIs

1. In the left sidebar, go to **APIs & Services** > **Library**
2. Search for and enable:
   - **Gmail API** (for sending emails)
   - **Google+ API** or **People API** (for user profile data)

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** (unless you have a Google Workspace)
3. Fill in the required fields:
   - **App name**: Discord Webhook Manager
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. On the **Scopes** page, click **Add or Remove Scopes**
6. Add the following scopes:
   - `https://www.googleapis.com/auth/gmail.send` (for sending emails)
   - `.../auth/userinfo.email` (for user authentication)
   - `.../auth/userinfo.profile` (for user authentication)
   - `openid` (for user authentication)
7. Click **Save and Continue**
8. On **Test users**, add:
   - Your Gmail address (the one you'll send emails from)
   - Any test users who should be able to sign in during development
9. Click **Save and Continue**

## Step 4: Create OAuth Client (Single Client for Both Purposes)

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Application type**: **Web application**
4. Name it: "Discord Webhook Manager OAuth Client"
5. Under **Authorized JavaScript origins**, add:
   ```text
   http://localhost:4000
   http://localhost:3000
   ```
   (Add your production URLs later)

6. Under **Authorized redirect URIs**, add:
   ```text
   http://localhost:4000/api/auth/google/callback
   https://developers.google.com/oauthplayground
   ```
   (Add your production callback URL later)

7. Click **Create**
8. **IMPORTANT**: Copy and save:
   - **Client ID** → `GOOGLE_CLIENT_ID`
   - **Client Secret** → `GOOGLE_CLIENT_SECRET`

## Step 5: Generate Refresh Token for Gmail Sending

1. Go to [Google OAuth2 Playground](https://developers.google.com/oauthplayground/)
2. Click the **gear icon** (⚙️) in the top right corner
3. Check **"Use your own OAuth credentials"**
4. Enter your **Client ID** and **Client Secret** from Step 4
5. Close the settings

6. In **Step 1** (Select & authorize APIs):
   - Scroll down to **Gmail API v1**
   - Select `https://www.googleapis.com/auth/gmail.send`
   - Click **Authorize APIs**
   - Sign in with the Gmail account you want to send emails from
   - Click **Allow**

7. In **Step 2** (Exchange authorization code for tokens):
   - Click **Exchange authorization code for tokens**
   - Copy the **Refresh token** → `GMAIL_REFRESH_TOKEN`

## Step 6: Update .env File

Add these to your `apps/backend/.env`:
```env
# Google OAuth2 Configuration (shared for both auth and Gmail)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Google OAuth2 - User Login
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:4000/api/auth/google/callback

# Gmail API - Email Sending (uses app owner's Gmail account)
GMAIL_REFRESH_TOKEN=your_refresh_token_here
FROM_EMAIL=your_email@gmail.com
```

---

## Summary

You now have **ONE OAuth client** that serves two purposes:

### Unified OAuth Client
- **Purpose**:
  1. Send emails from your Gmail account (using your refresh token)
  2. Let users sign in with their Google accounts (using their credentials)
- **Scopes**:
  - Gmail: `https://www.googleapis.com/auth/gmail.send`
  - User Auth: `profile`, `email`, `openid`
- **Redirect URIs**:
  - `https://developers.google.com/oauthplayground` (for generating refresh token)
  - `http://localhost:4000/api/auth/google/callback` (for user login)
- **Credentials**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`

**Key Point**: The same OAuth client is used, but the `GMAIL_REFRESH_TOKEN` belongs to YOUR account (the app owner) for sending system emails, while user authentication uses their own Google credentials.

---

## Final .env Configuration

Your `apps/backend/.env` should have:

```env
# Google OAuth2 Configuration (unified)
GOOGLE_CLIENT_ID=367458407321-xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# Google OAuth2 - User Login
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:4000/api/auth/google/callback

# Gmail API - Email Sending
GMAIL_REFRESH_TOKEN=1//04xxx
FROM_EMAIL=your_email@gmail.com

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## Troubleshooting

### "invalid_client" error when sending emails
**Cause**: Your `GMAIL_REFRESH_TOKEN` was generated with different OAuth client credentials than what's currently in `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`.

**Solution**: Regenerate the refresh token:
1. Go to [OAuth2 Playground](https://developers.google.com/oauthplayground/)
2. Click gear icon (⚙️) → Check "Use your own OAuth credentials"
3. Enter your current `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
4. Select Gmail API scope: `https://www.googleapis.com/auth/gmail.send`
5. Authorize and get new refresh token
6. Update `GMAIL_REFRESH_TOKEN` in your `.env` file
7. Restart your backend server

**Why**: Refresh tokens are cryptographically bound to the client credentials that created them. Changing the client requires regenerating the token.

### "unauthorized_client" error
- Make sure the refresh token was generated with the correct Client ID/Secret
- Verify Gmail API is enabled
- Check that your app is in "Testing" mode and you added yourself as a test user

### "redirect_uri_mismatch" error
- The redirect URI in your code must **exactly match** the one in Google Cloud Console
- No trailing slashes, check http vs https

### "Access blocked: This app's request is invalid"
- Make sure you've configured the OAuth consent screen
- Add yourself as a test user if the app is in testing mode
- Verify all required scopes are added in the consent screen

---

## Production Checklist

Before going to production:

1. **Add production URLs** to authorized origins and redirect URIs
2. **Publish your OAuth consent screen** (if you want public access)
3. **Use environment variables** for different environments (dev/staging/prod)
4. **Never commit** your `.env` file to version control
5. **Rotate credentials** if they're ever exposed

---

## Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth2 Playground](https://developers.google.com/oauthplayground/)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
