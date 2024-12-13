"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, DollarSign, ShieldCheck } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@prisma/client";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Withdraw", href: "/dashboard/withdraw", icon: DollarSign },
  {
    name: "Admin",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    adminOnly: true,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const filteredNavItems = navItems.filter(
    item => !item.adminOnly || user?.role === UserRole.ADMIN
  );

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
              ${isActive ? "text-blue-500 font-bold !important" : "text-white"}
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
