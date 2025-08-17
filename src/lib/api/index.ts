// Main API exports
export { apiClient } from './client';
export * from './types';

// Query exports
import { authQueries } from './queries/auth';
import { userQueries } from './queries/user';
import { webhookQueries } from './queries/webhook';
import { discordTokenQueries } from './queries/discord-token';
import { templateQueries } from './queries/template';
import { scheduledMessageQueries } from './queries/scheduled-message';
import { avatarQueries } from './queries/avatar';

// Convenience export for all queries
export const api = {
  auth: authQueries,
  user: userQueries,
  webhook: webhookQueries,
  discordToken: discordTokenQueries,
  template: templateQueries,
  scheduledMessage: scheduledMessageQueries,
  avatar: avatarQueries,
} as const;

export { authQueries, userQueries, webhookQueries, discordTokenQueries, templateQueries, scheduledMessageQueries, avatarQueries };