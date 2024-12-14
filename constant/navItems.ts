import { DollarSign, Home, ShieldCheck } from "lucide-react";

export const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Withdraw", href: "/dashboard/withdraw", icon: DollarSign },
  {
    name: "Admin",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    adminOnly: true,
  },
];