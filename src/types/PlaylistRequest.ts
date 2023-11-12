import { z } from 'zod';

export const PlaylistRequest = z.object({
    title: z.string(),
    description: z.string(),
    author_id: z.number(),
});

export type PlaylistRequest = z.infer<typeof PlaylistRequest>
