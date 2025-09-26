import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  topic: z.string().optional(),
  source: z.string().optional()
});
export type Lead = z.infer<typeof LeadSchema>;
