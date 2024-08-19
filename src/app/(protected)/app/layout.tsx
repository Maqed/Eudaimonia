import { type ReactNode } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "App",
};

function AppLayout({ children }: { children: ReactNode }) {
  return children;
}

export default AppLayout;
