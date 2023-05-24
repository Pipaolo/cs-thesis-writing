import { UserButton, useAuth, useUser } from "@clerk/nextjs";

const HomeHeader = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <UserButton
        userProfileMode="navigation"
        appearance={{
          elements: {
            avatarBox: "w-12 h-12",
          },
        }}
      />
    </div>
  );
};

export default HomeHeader;
