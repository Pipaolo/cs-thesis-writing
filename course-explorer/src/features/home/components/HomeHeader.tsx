import { Input } from "@/src/components/ui/input";
import { homeSearchTermAtom } from "@/src/pages";
import { UserButton } from "@clerk/nextjs";
import { useSetAtom } from "jotai";

const HomeHeader = () => {
  const setSearchTerm = useSetAtom(homeSearchTermAtom);

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
      <Input
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search any course you like..."
        type="text"
      />
    </div>
  );
};

export default HomeHeader;
