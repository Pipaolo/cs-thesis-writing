import { z } from "zod";

export const CourseFavIconsSchema = z.object({
  high_res: z.string().nullish(),
  low_res: z.string().nullish(),
});

export type CourseFavIcons = z.infer<typeof CourseFavIconsSchema>;

export const CourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
  is_sponsored: z.boolean().default(false).optional(),
  favicons: CourseFavIconsSchema,
});

export type Course = z.infer<typeof CourseSchema>;

export const CourseCSVSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
});

export type CourseCSV = z.infer<typeof CourseCSVSchema>;
