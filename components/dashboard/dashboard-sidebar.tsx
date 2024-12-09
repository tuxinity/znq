"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, DollarSign } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Withdraw", href: "/dashboard/withdraw", icon: DollarSign },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col space-y-2 w-full">
      {navItems.map(item => (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white text-white hover:text-blue-900 ${pathname === item.href ? "text-blue-500" : ""}`}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
