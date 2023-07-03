import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import Papa from "papaparse";
import { type CourseCSV, type Course } from "@/src/features/course/types";
import { api } from "@/src/utils";
import { useRouter } from "next/router";
import { Button, Input, useToast } from "@chakra-ui/react";
const AdminHomePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const addManyCourses = api.course.addMany.useMutation();
  const toast = useToast();
  const router = useRouter();

  const onUploadPressed = async () => {
    if (!file) {
      return;
    }

    const data = await new Promise<CourseCSV[]>((resolve, _) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      Papa.parse<CourseCSV>(file, {
        header: true,
        complete: (results) => {
          resolve(
            results.data.map((d) => ({
              description: !d.description ? "No description" : d.description,
              title: d.title,
              url: !d.url ? "NO_URL" : d.url,
            }))
          );
        },
      });
    });

    addManyCourses.mutate(data, {
      onSuccess: (_) => {
        toast({
          title: "Success",
          description: "Courses uploaded successfully",
        });
        void router.push("/");
      },
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      setFile(file);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col space-y-4 rounded-xl bg-blue-100 p-4 shadow-lg">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="courses" className="font-bold">
            Upload Course CSV
          </Label>
          <Input
            onChange={onFileChange}
            id="courses"
            type="file"
            disabled={addManyCourses.isLoading}
          />
        </div>
        <Button onClick={() => void onUploadPressed()} disabled={!file}>
          {addManyCourses.isLoading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default AdminHomePage;
