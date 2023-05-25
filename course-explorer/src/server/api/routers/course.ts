import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { createTRPCRouter } from "../trpc";
import googlethis from "googlethis";
import { CourseCSVSchema, CourseSchema } from "@/src/features/course/types";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
import { type Course } from "@prisma/client";
import { Fzf } from "fzf";
import axios from "axios";
import { env } from "@/src/env.mjs";

export type SearchResult = Awaited<
  ReturnType<typeof googlethis.search>
>["results"][0];

export const courseRouter = createTRPCRouter({
  addMany: protectedProcedure
    .input(z.array(CourseCSVSchema))
    .mutation(async ({ ctx, input }) => {
      const results = await ctx.prisma.course.createMany({
        data: input.map((course) => ({
          description: course.description,
          url: course.url,
          name: course.title,
        })),
        skipDuplicates: true,
      });

      return results;
    }),

  addInteractedCourse: protectedProcedure
    .input(
      z.object({
        course: CourseSchema,
        courses: z.array(CourseSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.auth.user;

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
          course: {
            connect: {
              id: course.id,
            },
          },
          user: {
            connectOrCreate: {
              where: {
                userId: user.id,
              },
              create: {
                userId: user.id,
                username: user.username ?? "",
              },
            },
          },
        },
      });

      return "Success";
    }),
  getRecommendedCourses: protectedProcedure.query(async ({ ctx, input }) => {
    const user = ctx.auth.user;
    if (!user) {
      return [];
    }
    const userDb = await ctx.prisma.user.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!userDb) {
      return [];
    }

    const interactions = await ctx.prisma.courseInteraction.findMany({
      where: {
        user: {
          userId: user.id,
        },
      },
    });

    if (interactions.length === 0) {
      return [];
    }

    const response = await axios.get<string[]>(
      `${env.RECOMMENDATION_API_URL}/courses/recommendations/${userDb.id}`
    );

    const courses = await ctx.prisma.course.findMany({
      where: {
        name: {
          in: response.data,
        },
      },
    });

    return courses;
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
          num: 20,
        },
      });
      const results = response.results;
      const fzf = new Fzf(results, {
        selector: (result) => result.title,
      });

      // Make sure that the results that are being returned are for courses
      const entries = fzf.find("course");
      const filteredResults = entries.map((entry) => entry.item);

      return filteredResults;
    }),
});
