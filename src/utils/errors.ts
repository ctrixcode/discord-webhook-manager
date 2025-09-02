export class UsageLimitExceededError extends Error {
  statusCode: number;
  type: 'webhook_limit' | 'media_limit'; // To distinguish between types of usage limits

  constructor(
    message: string,
    type: 'webhook_limit' | 'media_limit',
    statusCode: number = 403
  ) {
    super(message);
    this.name = 'UsageLimitExceededError';
    this.type = type;
    this.statusCode = statusCode;
    // This line is important for proper inheritance in TypeScript
    Object.setPrototypeOf(this, UsageLimitExceededError.prototype);
  }
}
