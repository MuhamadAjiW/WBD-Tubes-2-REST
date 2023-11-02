import { z } from 'zod';

export const AuthToken = z.object({
    author_id: z.number().int(),
});
export type AuthToken = z.infer<typeof AuthToken>
