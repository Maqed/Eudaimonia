import { db } from "@/server/db";

export async function getUserByID(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch {
    return null;
  }
}
