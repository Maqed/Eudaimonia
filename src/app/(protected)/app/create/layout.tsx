import { type ReactNode } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Create",
};

function CreateLayout({ children }: { children: ReactNode }) {
  return children;
}

export default CreateLayout;
