import { type ReactNode } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit",
};

function EditLayout({ children }: { children: ReactNode }) {
  return children;
}

export default EditLayout;
