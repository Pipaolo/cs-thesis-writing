import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { createTRPCRouter } from "../trpc";
import googlethis from "googlethis";
import { CourseSchema } from "@/src/features/course/types";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
import { type Course } from "@prisma/client";

export type SearchResult = Awaited<
  ReturnType<typeof googlethis.search>
>["results"][0];

export const courseRouter = createTRPCRouter({
  addInteractedCourse: protectedProcedure
    .input(
      z.object({
        course: CourseSchema,
        courses: z.array(CourseSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await clerkClient.users.getUser(ctx.auth.userId);

      if (!user) {
        throw new TRPCError({
          message: "Unauthorized",
          code: "FORBIDDEN",
        });
      }

      // Convert the courses to the correct format
      const parsedCourses = input.courses.map((course) => ({
        description: course.description,
        url: course.url,
        name: course.title,
      }));

      // Add all courses to the database
      const courses = await ctx.prisma.course.createMany({
        data: parsedCourses,
        skipDuplicates: true,
      });

      // Find the interacted course
      const course = await ctx.prisma.course.findFirst({
        where: {
          name: {
            equals: input.course.title,
          },
        },
      });

      if (!course) {
        throw new TRPCError({
          message: "No interacted course found!",
          code: "BAD_REQUEST",
        });
      }

      await ctx.prisma.courseInteraction.create({
        data: {
          userId: user.id,
          courseId: course.id,
        },
      });

      return {
        courses,
      };
    }),
  searchCourses: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query } = input;
      if (query === "") return [];

      const response = await googlethis.search(input.query, {
        page: 0,
        safe: true,
        additional_params: {
          hl: "en",
          num: 10,
        },
      });

      return response.results;
    }),
});
