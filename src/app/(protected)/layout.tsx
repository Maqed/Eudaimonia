import type { ReactNode } from "react";
import { checkIfLoggedIn } from "@/lib/server-utils";

async function ProtectedRoutesLayout({ children }: { children: ReactNode }) {
  await checkIfLoggedIn();

  return children;
}

export default ProtectedRoutesLayout;
