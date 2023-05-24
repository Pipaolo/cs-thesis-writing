import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 md:p-0">
      <SignUp />
    </div>
  );
}
