import { z } from 'zod';

export const BookPUpdateRequest = z.object({
    title: z.string().optional(),
    synopsis: z.string().optional(),
    genre: z.string().optional(),
    release_date: z.string().refine((dateString) => {
        const parsedDate = new Date(dateString);
        return !isNaN(parsedDate.getTime());
    }, { message: "Invalid date format" }).transform((dateString) => new Date(dateString)),
    word_count: z.number().optional(),
    duration: z.number().optional(),
    graphic_cntn: z.boolean().optional(),
    image_path: z.string().optional(),
    audio_path: z.string().optional(),
});
export type BookPUpdateRequest = z.infer<typeof BookPUpdateRequest>