"use server";
import { getServerAuthSession } from "@/server/auth";
import type { z } from "zod";
import type { userSettingsSchema } from "@/zod/user-settings";
import { db } from "@/server/db";

export async function deleteAccountAction() {
  const session = await getServerAuthSession();
  if (!session) return { error: "You must be logged in!" };
  await db.user.delete({ where: { id: session.user.id } });
  return { message: "User has been deleted successfully!" };
}

export async function updateUserAction(
  values: z.infer<typeof userSettingsSchema>,
) {
  const session = await getServerAuthSession();
  if (!session) return { error: "You must be logged in!" };
  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      ...values,
    },
  });
  return { message: "User has been updated successfully!" };
}
