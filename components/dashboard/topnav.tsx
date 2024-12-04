"use client";
import Link from "next/link";
import Image from "next/image"
import { UserNav } from "./user-nav";

export const TopNav = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="flex h-16 items-center px-8">
        <Link
          href="/dashboard"
          className="flex items-center text-lg font-semibold"
        >
          <Image src="/logo-text.png" alt="logo-image" width={150} height={40} />
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
