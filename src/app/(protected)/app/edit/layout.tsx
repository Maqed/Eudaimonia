import { type ReactNode } from "react";
import { type Metadata } from "next";
import { env } from "process";

const title = "Edit";
const description = "Edit Group";
export const metadata: Metadata = {
  title: title,
  description,
  openGraph: {
    title,
    description,
    images: [`${env.NEXTAUTH_URL}/logo.png`],
    siteName: "Eudaimonia",
    locale: "es-ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${env.NEXTAUTH_URL}/logo.png`],
  },
};

function EditLayout({ children }: { children: ReactNode }) {
  return children;
}

export default EditLayout;
