import { Skeleton } from "@/src/components/ui/skeleton";
import { type RouterOutputs, api } from "@/src/utils";
import { CourseSchema } from "../../course/types";
import { useMemo } from "react";

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
          <Skeleton className="h-40 w-48  flex-shrink-0 bg-gray-300" />
          <Skeleton className="h-40 w-48  flex-shrink-0 bg-gray-300" />
          <Skeleton className="h-40 w-48  flex-shrink-0 bg-gray-300" />
        </div>
      );
    }

    const data = recommendedCourses.data ?? [];

    if (data.length === 0) {
      return (
        <div className="flex w-full flex-col items-center ">
          <h5 className="font-bold">No recommendations found</h5>
          <p className="text-xs">Try searching for a course and clicking it</p>
        </div>
      );
    }

    return data.map((course, i) => (
      <div
        key={course.id}
        className="w-48 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-blue-400 bg-opacity-50 p-4 
        text-black shadow-md transition duration-200 ease-in-out hover:shadow-lg
        "
        onClick={() => void onCourseClick(i)}
      >
        <h5 className="font-bold">{course.name}</h5>
        <p className="text-xs">{course.description}</p>
      </div>
    ));
  };

  return (
    <div className="flex flex-col">
      <h4 className="text-xl font-extrabold">You might also like this:</h4>
      <div className="flex max-h-72  justify-start space-x-4 overflow-x-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
};
export default HomeRecommendationList;
