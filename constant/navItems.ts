import { DollarSign, Home, ShieldCheck } from "lucide-react";

export const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: Home, adminOnly: false },
  {
    name: "Withdraw",
    href: "/dashboard/withdraw",
    icon: DollarSign,
    adminOnly: false,
  },
  {
    name: "Admin",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    adminOnly: true,
  },
];
