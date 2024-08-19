import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/consts/routes";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();
  if (session) {
    redirect(DEFAULT_LOGIN_REDIRECT);
  }
  return (
    <main className="h-screen-without-navbar flex w-full items-center justify-center">
      {children}
    </main>
  );
}
