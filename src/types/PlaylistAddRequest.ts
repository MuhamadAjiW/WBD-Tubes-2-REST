import { z } from 'zod';

export const PlaylistAddRequest = z.object({
    title: z.string(),
    description: z.string(),
    author_id: z.number(),
    image_path: z.string(),
    image: z.string(),
});

export type PlaylistAddRequest = z.infer<typeof PlaylistAddRequest>
