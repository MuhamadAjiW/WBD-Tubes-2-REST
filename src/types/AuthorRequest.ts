import { z } from 'zod';

export const AuthorRequest = z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(8),
    name: z.string(),
    bio: z.string(),
});
export type AuthorRequest = z.infer<typeof AuthorRequest>