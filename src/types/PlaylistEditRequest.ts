import { z } from 'zod';

export const PlaylistEditRequest = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    author_id: z.number().optional(),
    image_path: z.string().optional(),
    image: z.string().optional(),
});

export type PlaylistEditRequest = z.infer<typeof PlaylistEditRequest>