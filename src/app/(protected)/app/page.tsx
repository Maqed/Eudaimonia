import YourGroups from "./_components/your-groups";
import Discover from "./_components/discover";
import { getDiscoverGroups, getYourGroups } from "@/database/groups";
import { checkIfLoggedIn } from "@/lib/server-utils";
import AdBanner from "@/components/ads/ad-banner";

async function AppPage() {
  const { session } = await checkIfLoggedIn();

  const yourGroups = await getYourGroups(session);

  const discoverCarouselGroups = await getDiscoverGroups({ session, take: 4 });

  return (
    <main className="container pt-10">
      <YourGroups groups={yourGroups} />
      <Discover groups={discoverCarouselGroups} />
      <AdBanner
        dataAdFormat="auto"
        dataAdSlot="2624939235"
        dataFullWidthResponsive={true}
      />
    </main>
  );
}

export default AppPage;
