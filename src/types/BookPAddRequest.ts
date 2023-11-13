import { z } from 'zod';

export const BookPAddRequest = z.object({
    title: z.string(),
    synopsis: z.string(),
    genre: z.string(),
    release_date: z.string().refine((dateString) => {
        const parsedDate = new Date(dateString);
        return !isNaN(parsedDate.getTime());
    }, { message: "Invalid date format" }).transform((dateString) => new Date(dateString)),
    word_count: z.number(),
    duration: z.number(),
    graphic_cntn: z.boolean(),
    image_path: z.string(),
    audio_path: z.string(),
    author_id: z.number(),
    image: z.string(),
    audio: z.string(),
});
export type BookPAddRequest = z.infer<typeof BookPAddRequest>