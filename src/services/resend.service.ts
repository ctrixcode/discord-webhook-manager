import { CreateEmailOptions, Resend } from 'resend';
import { logger } from '../utils';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export const sendEmail = async (options: SendEmailOptions) => {
  try {
    const { to, subject, html, text, from, replyTo } = options;

    const data = await resend.emails.send({
      from: from || 'onboarding@resend.dev',
      to: to,
      subject: subject,
      html: html,
      text: text,
      replyTo: replyTo,
    } as CreateEmailOptions);

    logger.info('Email sent successfully:', data);
    return data;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};
