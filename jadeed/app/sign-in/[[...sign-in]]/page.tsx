import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07382b] px-4">
      <div className="w-full max-w-md">
        <p className="display mb-6 text-center text-4xl text-[#f6f1e8]">Jadeeed</p>
        <p className="mb-8 text-center text-sm text-[#d9c8a3]">
          Sign in to your planner workspace. New accounts are invite-only.
        </p>
        <SignIn
          routing="path"
          path="/sign-in"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              footerAction: { display: "none" },
              footer: { display: "none" },
            },
          }}
        />
      </div>
    </div>
  );
}
