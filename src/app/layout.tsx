import "@/styles/globals.css";
import Navbar from "@/components/navbar/navbar";
import Providers from "@/providers";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Eudaimonia",
    template: `%s | ${"Eudaimonia"}`,
  },
  keywords: ["Eudaimonia"],
  description:
    "Eudaimonia is a website that helps you improve your life by tracking your habits with your friends",
  openGraph: {
    title: "Eudaimonia",
    description:
      "Eudaimonia is a website that helps you improve your life by tracking your habits with your friends",
    siteName: "Eudaimonia",
    locale: "es-ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eudaimonia",
    description:
      "Eudaimonia is a website that helps you improve your life by tracking your habits with your friends",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable}`}>
      <body>
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
