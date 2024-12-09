"use server"

import * as z from "zod";

import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { getCurrentUser } from "@/lib/auth";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Unautorized" }
  }

  const dbUser = await getUserById(user.id || "")

  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values
    }
  })

  return { success: "Settings Updated!" }
}