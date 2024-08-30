import { type ReactNode } from "react";
import { type Metadata } from "next";
import { env } from "process";

const title = "Create";
const description = "Create a group";

export const metadata: Metadata = {
  title,
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

function CreateLayout({ children }: { children: ReactNode }) {
  return children;
}

export default CreateLayout;
