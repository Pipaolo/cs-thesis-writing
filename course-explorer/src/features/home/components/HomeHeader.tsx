/* eslint-disable @typescript-eslint/no-misused-promises */

import { courseSearchAtom } from "@/src/pages";
import { useAtomValue } from "jotai";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HomeSearchFormSchema } from "../types";
import { useRouter } from "next/router";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

interface Props {
  isLoading: boolean | undefined;
}
const HomeHeader = (props: Props) => {
  const router = useRouter();

  const searchTerm = useAtomValue(courseSearchAtom);
  const { register, handleSubmit } = useForm<HomeSearchFormSchema>({
    resolver: zodResolver(HomeSearchFormSchema),
    values: {
      query: searchTerm,
    },
  });

  const onSubmit = (data: HomeSearchFormSchema) => {
    const { query } = data;
    const path = query ? `/?q=${query}` : "/";
    console.log("Submitting", data);

    void router.push(path, undefined, {
      shallow: true,
    });
  };

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <form
        onSubmit={handleSubmit(onSubmit, console.error)}
        className="flex w-full space-x-4"
      >
        <InputGroup>
          <Input
            {...register("query")}
            className="peer bg-secondary-button placeholder:text-text focus:border-primary-button "
            placeholder="Search any course you like..."
            variant={"filled"}
            rounded={"full"}
            type="text"
          />
          <InputLeftElement className="transition duration-300 peer-focus:text-primary-button">
            <SearchIcon size={"1.2rem"} />
          </InputLeftElement>
        </InputGroup>
      </form>
    </div>
  );
};

export default HomeHeader;
