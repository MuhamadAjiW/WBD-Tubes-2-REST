import { z } from 'zod';

export const SOAPRequest = z.object({
    handler: z.string(),
    method: z.string(),
    args: z.map(z.string(), z.string()).optional(),
});
export type SOAPRequest = z.infer<typeof SOAPRequest>
