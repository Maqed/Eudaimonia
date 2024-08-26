"use client";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function ClientSideProviders({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default ClientSideProviders;
