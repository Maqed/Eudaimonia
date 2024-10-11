import YourGroups from "./_components/your-groups";
import Discover from "./_components/discover";
import { getDiscoverGroups, getYourGroups } from "@/database/groups";
import { checkIfLoggedIn } from "@/lib/server-utils";

async function AppPage() {
  const { session } = await checkIfLoggedIn();

  const yourGroups = await getYourGroups();

  const discoverCarouselGroups = await getDiscoverGroups({ take: 4 });

  return (
    <main className="container pt-10">
      <YourGroups groups={yourGroups} />
      <Discover groups={discoverCarouselGroups} />
    </main>
  );
}

export default AppPage;
