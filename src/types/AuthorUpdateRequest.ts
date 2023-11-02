import { z } from 'zod';

export const AuthorUpdateRequest = z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string().min(8).optional(),
    name: z.string().optional(),
    bio: z.string().optional(),
});
export type AuthorUpdateRequest = z.infer<typeof AuthorUpdateRequest>