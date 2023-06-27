import { type RouterOutputs, api } from "@/src/utils";
import { CourseSchema } from "../../course/types";
import { useMemo } from "react";
import { Heading, Skeleton, Tooltip } from "@chakra-ui/react";

type Course = RouterOutputs["course"]["getRecommendedCourses"][0];

const HomeRecommendationList = () => {
  const recommendedCourses = api.course.getRecommendedCourses.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const courses = useMemo<Course[]>(() => {
    return recommendedCourses?.data ?? [];
  }, [recommendedCourses.data]);

  const onCourseClick = (index: number) => {
    const course = courses[index];

    window.open(course?.url, "_blank");
  };

  const renderContent = () => {
    if (recommendedCourses.isLoading) {
      return (
        <div className="flex w-full space-x-4">
          <Skeleton className="h-52  w-48 flex-shrink-0  rounded-xl bg-gray-300" />
          <Skeleton className="h-52  w-48 flex-shrink-0  rounded-xl bg-gray-300" />
          <Skeleton className="h-52  w-48 flex-shrink-0  rounded-xl bg-gray-300" />
          <Skeleton className="h-52  w-48 flex-shrink-0  rounded-xl bg-gray-300" />
          <Skeleton className="h-52  w-48 flex-shrink-0  rounded-xl bg-gray-300" />
        </div>
      );
    }

    const data = recommendedCourses.data ?? [];
    // const data = [];

    if (data.length === 0) {
      return (
        <div className="flex  w-full flex-col items-center justify-start space-x-4 space-y-4 overflow-x-auto rounded-xl border border-accent bg-background p-4 ">
          <Heading size={"md"} className="text-text">
            No recommendations found
          </Heading>
          <p className="text-sm text-text">
            Try searching for a course and clicking it
          </p>
        </div>
      );
    }

    return data.map((course, i) => (
      <Tooltip label="Click to visit" className="rounded-full bg-accent">
        <div
          key={course.id}
          className="flex w-48 flex-shrink-0 cursor-pointer flex-col space-y-2 overflow-hidden rounded-xl  bg-secondary-button
        p-4 text-text shadow-md shadow-primary-button/50 outline-primary-button/20 transition duration-500 ease-in-out hover:outline 
        "
          onClick={() => void onCourseClick(i)}
        >
          <Heading size={"sm"}>{course.name}</Heading>
          <p className="text-xs">{course.description}</p>
        </div>
      </Tooltip>
    ));
  };

  return (
    <div className="flex flex-col">
      <h4 className="text-xl font-extrabold text-text">
        You might also like this:
      </h4>
      <div className=" flex  max-h-72 justify-start space-x-4 overflow-x-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
};
export default HomeRecommendationList;
