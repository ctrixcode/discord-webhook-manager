// Discord utility functions

// Convert hex color to Discord color integer
export const hexToDiscordColor = (hex: string): number => {
  return Number.parseInt(hex.replace('#', ''), 16);
};

// Convert Discord color integer to hex
export const discordColorToHex = (color: number): string => {
  return `#${color.toString(16).padStart(6, '0')}`;
};

// Validate Discord webhook URL
export const validateWebhookUrl = (url: string): boolean => {
  const webhookRegex = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
  return webhookRegex.test(url);
};

// Format scheduled time for display
export const formatScheduledTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  if (diffMs < 0) {
    return 'Overdue';
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else if (diffMinutes > 0) {
    return `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else {
    return 'very soon';
  }
};