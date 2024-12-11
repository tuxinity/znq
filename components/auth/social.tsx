"use client";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callback: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="items-center w-full gap-x-2">
      <div className="relative flex items-center w-full">
        <hr className="w-full border-gray-300" />
        <span className="absolute px-4 bg-white text-gray-500 text-sm">or</span>
      </div>
      <Button
        className="w-full mt-8"
        size="lg"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      {/* <Button
        className="w-full"
        size="lg"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5" />
      </Button> */}
    </div>
  );
};
