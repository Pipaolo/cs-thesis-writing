/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { homeSearchTermAtom } from "@/src/pages";
import { UserButton } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HomeSearchFormSchema } from "../types";

interface Props {
  isLoading: boolean | undefined;
}
const HomeHeader = (props: Props) => {
  const { isLoading = false } = props;
  const [searchTerm, setSearchTerm] = useAtom(homeSearchTermAtom);
  const { register, handleSubmit } = useForm<HomeSearchFormSchema>({
    resolver: zodResolver(HomeSearchFormSchema),
    values: {
      query: searchTerm,
    },
  });

  const onSubmit = (data: HomeSearchFormSchema) => {
    setSearchTerm(data.query);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <UserButton
        userProfileMode="navigation"
        appearance={{
          elements: {
            avatarBox: "w-12 h-12",
          },
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full space-x-4">
        <Input
          {...register("query")}
          placeholder="Search any course you like..."
          type="text"
        />
        <Button type="submit" disabled={isLoading}>
          <div className="flex space-x-2">
            <span>Search</span>
            <SearchIcon size={"1rem"} />
          </div>
        </Button>
      </form>
    </div>
  );
};

export default HomeHeader;
