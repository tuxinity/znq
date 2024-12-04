"use client";
import Link from "next/link";
import { UserNav } from "./user-nav";

export function TopNav() {
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="flex h-16 items-center px-4">
        <Link
          href="/dashboard"
          className="flex items-center text-lg font-semibold"
        >
          <img src="/logo-text.png" alt="logo-image" className="w-40" />
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
