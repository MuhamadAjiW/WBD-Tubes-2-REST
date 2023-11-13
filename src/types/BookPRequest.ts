import { z } from 'zod';

export const BookPRequest = z.object({
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
});
export type BookPRequest = z.infer<typeof BookPRequest>