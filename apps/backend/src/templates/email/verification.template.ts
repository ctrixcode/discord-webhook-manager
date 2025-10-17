export interface VerificationEmailData {
  verificationLink: string;
}

/**
 * Get the subject for the verification email
 */
export const getVerificationEmailSubject = (): string => {
  return 'Verify your email address';
};

/**
 * Get the HTML content for the verification email
 */
export const getVerificationEmailHtml = (
  data: VerificationEmailData
): string => {
  const { verificationLink } = data;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; border-radius: 10px; padding: 30px;">
        <h2 style="color: #5865F2; margin-bottom: 20px;">Welcome to Discord Webhook Manager!</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
          Thank you for signing up! Please verify your email address to get started.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}"
             style="background-color: #5865F2;
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                    font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Or copy and paste this link in your browser:
        </p>
        <p style="font-size: 12px; color: #5865F2; word-break: break-all; background-color: #fff; padding: 10px; border-radius: 5px;">
          ${verificationLink}
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="font-size: 12px; color: #999;">
          This link will expire in 24 hours. If you didn't request this, please ignore this email.
        </p>
      </div>
    </body>
    </html>
  `;
};
