import type { ReactNode } from "react";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";

async function ProtectedRoutesLayout({ children }: { children: ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect(DEFAULT_UNAUTHENTICATED_REDIRECT);
  }
  return children;
}

export default ProtectedRoutesLayout;
