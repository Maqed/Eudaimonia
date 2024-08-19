import ClientSideProviders from "./client-side";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function Providers({ children }: Props) {
  return <ClientSideProviders>{children}</ClientSideProviders>;
}

export default Providers;
