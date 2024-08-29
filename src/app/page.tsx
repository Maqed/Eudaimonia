import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import Hero from "./_components/hero";
import HowItWorks from "./_components/how-it-works";
import { getDiscoverGroups } from "@/database/groups";

export default async function HomePage() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/app");
  }

  const randomGroups = await getDiscoverGroups({ take: 1, session });
  const randomGroup = randomGroups[0];

  return (
    <main>
      <Hero />
      <HowItWorks randomGroup={randomGroup} />
    </main>
  );
}
