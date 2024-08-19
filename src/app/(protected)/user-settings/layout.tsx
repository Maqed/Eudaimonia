import { type Metadata } from "next";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "User Settings",
};

function UserSettingsLayout({ children }: { children: ReactNode }) {
  return children;
}

export default UserSettingsLayout;
