/**
 * Validates if the given URL is a valid Discord webhook URL.
 * @param url The URL to validate.
 * @returns True if the URL is a valid Discord webhook URL, false otherwise.
 */
export const isValidDiscordWebhookUrl = (url: string): boolean => {
  const discordWebhookRegex = new RegExp(
    /^https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\/(\d+)\/([\w-]+)$/
  );
  return discordWebhookRegex.test(url);
};
