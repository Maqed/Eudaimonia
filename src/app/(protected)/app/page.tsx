import YourGroups from "./_components/your-groups";
import Discover from "./_components/discover";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";
import { getDiscoverGroups, getYourGroups } from "@/actions/groups";

async function AppPage() {
  const headersList = headers();
  // read the custom x-url header
  const header_url = headersList.get("x-pathname");
  const session = await getServerAuthSession();
  if (!session) {
    redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
  }

  const yourGroups = await getYourGroups(session);

  const discoverCarouselGroups = await getDiscoverGroups({ session, take: 4 })

  return (
    <main className="container pt-10">
      <YourGroups groups={yourGroups} />
      <Discover groups={discoverCarouselGroups} />
    </main>
  );
}

export default AppPage;