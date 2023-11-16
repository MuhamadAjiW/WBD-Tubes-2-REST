import { z } from 'zod';

export const SubscriptionUpdateRequest = z.object({
    status: z.string().refine((value) => value === "ACCEPT" || value === "REJECT", {
        message: "Method must be either 'ACCEPT' or 'REJECT'",
    }),
});
export type SubscriptionUpdateRequest = z.infer<typeof SubscriptionUpdateRequest>
