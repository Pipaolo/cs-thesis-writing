import { type RouterOutputs } from "@/src/utils/api";

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

  const onCoursePressed = (index: number) => {
    const course = data[index];
    if (!course) return;

    // Navigate to the link
    window.open(course.url, "_blank");
  };

  const renderItems = () => {
    if (isLoading) {
      return <HomeCourseListLoader />;
    }

    return data.map((course, i) => {
      return (
        <div
          onClick={() => onCoursePressed(i)}
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
