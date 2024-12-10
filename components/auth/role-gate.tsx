"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@prisma/client";
import { FormError } from "../form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentUser();

  if (role?.role !== allowedRole) {
    return (
      <FormError message="You dont have permission to view this content!" />
    );
  }

  return <>{children}</>;
};
