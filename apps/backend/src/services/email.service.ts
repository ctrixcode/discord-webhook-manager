import { google } from 'googleapis';
import { logger } from '../utils';
import {
  getVerificationEmailHtml,
  getVerificationEmailSubject,
  type VerificationEmailData,
} from '../templates/email';

const OAuth2 = google.auth.OAuth2;

/**
 * Create a transporter object using OAuth2 authentication
 */
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const accessToken = await oauth2Client.getAccessToken();

  return {
    auth: oauth2Client,
    accessToken: accessToken.token,
  };
};

/**
 * Create a raw email message in base64 format
 */
const createEmailMessage = (
  to: string,
  subject: string,
  htmlContent: string
): string => {
  const fromEmail = process.env.FROM_EMAIL || 'noreply@example.com';

  const emailLines = [
    `From: ${fromEmail}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlContent,
  ];

  const email = emailLines.join('\r\n');
  return Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    const templateData: VerificationEmailData = {
      verificationLink,
    };

    const subject = getVerificationEmailSubject();
    const htmlContent = getVerificationEmailHtml(templateData);

    const { auth } = await createTransporter();
    const gmail = google.gmail({ version: 'v1', auth });

    const encodedMessage = createEmailMessage(email, subject, htmlContent);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw error;
  }
};
