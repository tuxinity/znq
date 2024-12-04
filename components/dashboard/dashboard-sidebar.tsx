"use client";

import Link from "next/link";
import { Home, BarChart2, Users, Settings } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  return (
    <nav className="flex flex-col space-y-2 w-full">
      {navItems.map(item => (
        <Link
          key={item.name}
          href={item.href}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-500 text-white hover:text-blue-900"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
