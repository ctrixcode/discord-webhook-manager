import { Static, Type } from '@sinclair/typebox';

export const userUsageResponseSchema = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    webhookMessagesSentToday: Type.Number(),
    totalMediaStorageUsed: Type.Number(),
    dailyWebhookMessageLimit: Type.Number(),
    overallMediaStorageLimit: Type.Number(),
  }),
});

export type UserUsageResponse = Static<typeof userUsageResponseSchema>;
