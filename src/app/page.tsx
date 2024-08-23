import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import Hero from "./_components/hero";

export default async function HomePage() {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/app");
  }
  return (
    <main className="container">
      <Hero />
    </main>
  );
}
