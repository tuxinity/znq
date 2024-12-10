"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar"
import { FaUser } from "react-icons/fa"
import { ExitIcon } from "@radix-ui/react-icons"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { LogoutButton } from "./logout-button"
import { UserInfoDialog } from "../user-info-dialog"

export const UserButton = () => {
  const user = useCurrentUser()

  console.log("user", user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image ?? ""} />
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-slate-900" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-white">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground text-slate-300">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <UserInfoDialog user={user}/>
        <LogoutButton>
          <DropdownMenuItem className="text-white">
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}