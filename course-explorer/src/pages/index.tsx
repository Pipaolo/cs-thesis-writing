import { UserButton } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
import {
  HomeCourseList,
  HomeHeader,
  HomeRecommendationList,
} from "../features/home/components";
import { useEffect, useMemo } from "react";
import { type SearchResult } from "../server/api/routers/course";
import { atom, useAtom, useAtomValue } from "jotai";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import { Heading } from "@chakra-ui/react";

export const courseSearchAtom = atom("");

const HomePage: NextPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const query = useMemo(() => {
    if (typeof q === "string") {
      return q;
    }

    return "";
  }, [q]);
  const [searchTerm, setSearchTerm] = useAtom(courseSearchAtom);

  const searchCourses = api.course.searchCourses.useQuery(
    {
      query,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setSearchTerm(query ?? "");
  }, [query, setSearchTerm]);

  const courses = useMemo<SearchResult[]>(() => {
    return searchCourses.data || [];
  }, [searchCourses.data]);

  return (
    <>
      <Head>
        <title>Course Explorer</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full min-h-screen flex-col items-center  space-y-4 bg-background p-4">
        <div className="flex w-full items-center justify-between">
          <Heading size={"md"}>Course Explorer</Heading>
          <UserButton
            userProfileMode="navigation"
            appearance={{
              elements: {
                avatarBox: "w-12 h-12",
              },
            }}
          />
        </div>
        <div className="container w-full space-y-4 rounded-md  p-4 ">
          <HomeHeader isLoading={searchCourses.isLoading} />
          <div className="flex flex-col space-y-4 px-0 md:px-4">
            <HomeRecommendationList />
            <HomeCourseList
              isLoading={searchCourses.isLoading}
              data={courses}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
