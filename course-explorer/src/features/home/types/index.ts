import { z } from "zod";

export const HomeSearchFormSchema = z.object({
  query: z.string().default(""),
});

export type HomeSearchFormSchema = z.infer<typeof HomeSearchFormSchema>;
