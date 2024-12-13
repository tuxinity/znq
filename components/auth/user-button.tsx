"use client";

import { FaUser } from "react-icons/fa";
import { ExitIcon, GearIcon } from "@radix-ui/react-icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LogoutButton } from "./logout-button";
import { useState } from "react";
import { SettingsForm } from "./settings-form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const UserButton = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, isLoading } = useCurrentUser();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            {isLoading ? (
              <AvatarFallback className="bg-gray-500 animate-pulse">
                <span className="text-white">...</span>
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage src={user?.image ?? ""} />
                <AvatarFallback className="bg-sky-500">
                  <FaUser className="text-white" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-40 bg-slate-900"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            {isLoading ? (
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-400">
                  Loading...
                </p>
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">
                  {user?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground text-slate-300">
                  {user?.email}
                </p>
              </div>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-white"
            onSelect={() => setIsSettingsOpen(true)}
          >
            <GearIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <LogoutButton>
            <DropdownMenuItem className="text-white">
              <ExitIcon className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Settings</DialogTitle>
            <DialogDescription>
              Update your profile settings here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          <SettingsForm />
        </DialogContent>
      </Dialog>
    </>
  );
};
