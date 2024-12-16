"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@prisma/client";
import { NAV_ITEMS } from "@/constant/navItems";
import { useMemo } from "react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return null;
  }

  const filteredNavItems = useMemo(() => {
    if (!user) return [];

    return NAV_ITEMS.filter(
      item => {
        if (user?.role === UserRole.ADMIN) return item.adminOnly;
        else { return !item.adminOnly; }
      })
  }, [user]);

  return (
    <nav className="flex flex-col space-y-2 w-full">
      {filteredNavItems.map(item => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg 
              hover:bg-white hover:text-blue-900 
              ${isActive ? "text-blue-500 font-bold" : "text-white"}
            `}
          >
            <item.icon
              className={`h-5 w-5 ${isActive ? "text-blue-500" : ""}`}
            />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
