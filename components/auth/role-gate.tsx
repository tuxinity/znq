"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@prisma/client";
import { FormError } from "../form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
  showMessage?: boolean;
}

export const RoleGate = ({
  children,
  allowedRole,
  showMessage = false,
}: RoleGateProps) => {
  const role = useCurrentUser();

  if (role?.role !== allowedRole) {
    if (showMessage) {
      return (
        <FormError message="You dont have permission to view this content!" />
      );
    }
    return null;
  }

  return <>{children}</>;
};
