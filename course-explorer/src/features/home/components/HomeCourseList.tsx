import { type RouterOutputs } from "@/src/utils/api";

type Courses = RouterOutputs["course"]["searchCourses"];
type Course = Courses[0];

interface Props {
  data: RouterOutputs["course"]["searchCourses"];
}

const HomeCourseList = (props: Props) => {
  const { data } = props;

  const onCoursePressed = (index: number) => {
    const course = data[index];
    if (!course) return;

    // Navigate to the link
    window.open(course.url, "_blank");
  };

  return (
    <div className="flex flex-col space-y-4">
      {data.map((course, i) => {
        return (
          <div
            onClick={() => onCoursePressed(i)}
            key={i}
            className="flex flex-col space-y-2 rounded-xl bg-white p-4 shadow-md"
          >
            <span className="text-lg font-bold">{course.title}</span>
            <span className="text-xs">{course.description}</span>
          </div>
        );
      })}
    </div>
  );
};

export default HomeCourseList;
