"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/constant/navItems";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePathname } from "next/navigation";

export const MobileMenu = () => {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  const filteredNavItems = NAV_ITEMS.filter(
    item => !item.adminOnly || user?.role === UserRole.ADMIN
  );


  return (
    <div className="md:hidden flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <HamburgerMenuIcon color="white" width={32} height={24} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-40 bg-slate-900"
          align="end"
          forceMount
        >
          {filteredNavItems.map(item => {
            return (
              <DropdownMenuItem
                key={`nav_${item.name}`}
                className={`text-white ${pathname === item.href ? "bg-white text-blue-900" : ""}`}
              >
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg 
               
            `}
                >
                  <item.icon
                    className={`h-5 w-5`}
                  />
                  <span>{item.name}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
