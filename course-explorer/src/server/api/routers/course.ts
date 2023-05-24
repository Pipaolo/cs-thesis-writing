import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { createTRPCRouter } from "../trpc";
import googlethis from "googlethis";

export type SearchResult = Awaited<
  ReturnType<typeof googlethis.search>
>["results"][0];

export const courseRouter = createTRPCRouter({
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
