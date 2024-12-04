import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const fonts = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-gray-800">
      <div className="space-y-6">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            fonts.className,
          )}
        >
          ZENQIRA
        </h1>
        <p className="text-white text-lg items-center">
          simple authentication service
        </p>
        <div className="items-center justify-center">
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign Up
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
