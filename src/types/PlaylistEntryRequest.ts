import { z } from 'zod';

export const PlaylistEntryRequest = z.object({
    playlist_id: z.number(),
    bookp_id: z.number(),
})

export type PlaylistEntryRequest = z.infer<typeof PlaylistEntryRequest>