import { courseSearchAtom } from "@/src/pages";
import { api, type RouterOutputs } from "@/src/utils/api";
import { useAtomValue } from "jotai";

type Courses = RouterOutputs["course"]["searchCourses"];

interface Props {
  data: RouterOutputs["course"]["searchCourses"];
  isLoading: boolean | undefined;
}

const HomeCourseListLoader = () => {
  return (
    <div className="flex animate-pulse space-x-4">
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 w-3/4 rounded bg-gray-400"></div>
        <div className="space-y-2">
          <div className="h-4 rounded bg-gray-400"></div>
          <div className="h-4 w-5/6 rounded bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

const HomeCourseList = (props: Props) => {
  const { data, isLoading = false } = props;
  const searchTerm = useAtomValue(courseSearchAtom);
  const interactedCourse = api.course.addInteractedCourse.useMutation();

  const onCoursePressed = (index: number) => {
    const course = data[index];
    if (!course) return;

    interactedCourse.mutate({
      course: course,
      courses: data,
    });
    // Navigate to the link
    window.open(course.url, "_blank");
  };

  const renderItems = () => {
    if (isLoading) {
      return <HomeCourseListLoader />;
    }

    if (searchTerm === "") {
      return (
        <div className="rounded-xl bg-gradient-to-br from-blue-300 to-blue-800  p-4 text-center font-bold  shadow-md">
          <h4 className="text-lg text-white">Search for a course</h4>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="rounded-xl bg-gradient-to-br from-blue-300 to-blue-800  p-4 text-center font-bold  shadow-md">
          <h4 className="text-lg text-white">No Courses Found</h4>
        </div>
      );
    }

    return data.map((course, i) => {
      return (
        <div
          onClick={() => void onCoursePressed(i)}
          key={i}
          className="flex cursor-pointer flex-col space-y-2 overflow-hidden rounded-xl bg-white p-4
          shadow-md transition duration-200 ease-in-out hover:shadow-lg
          "
        >
          <span className="text-lg font-bold">{course.title}</span>
          <span className="text-xs">{course.description}</span>
        </div>
      );
    });
  };

  return <div className="flex flex-col space-y-4">{renderItems()}</div>;
};

export default HomeCourseList;
