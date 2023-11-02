import { z } from 'zod';

export const TokenRequest = z.object({
    email: z.string().email(),
    password: z.string(),
});
export type TokenRequest = z.infer<typeof TokenRequest>