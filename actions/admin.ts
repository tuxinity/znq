"use server"

import { getCurrentRole } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export const admin = async () => {
  const role = await getCurrentRole();

  if (role !== UserRole.ADMIN) {
    return { error: "Forbidden!" }
  }

  return { success: "Allowed!" }
}