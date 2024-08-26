import type { ReactNode } from "react";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";
import { getUserByID } from "@/database/users";

async function ProtectedRoutesLayout({ children }: { children: ReactNode }) {
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
  return children;
}

export default ProtectedRoutesLayout;
