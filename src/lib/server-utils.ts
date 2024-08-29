import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { getUserByID } from "@/database/users";
import { getServerAuthSession } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function checkIfLoggedIn() {
  const headersList = headers();
  // read the custom x-url header
  const header_url = headersList.get("x-pathname");
  const session = await getServerAuthSession();
  if (!session) {
    redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
  }
  const existingUser = await getUserByID(session.user.id);
  if (existingUser?.isBanned) {
    redirect("/logout");
  }
  return { session };
}
