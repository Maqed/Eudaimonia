import YourGroups from "./_components/your-groups";
import Discover from "./_components/discover";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";

async function AppPage() {
  const headersList = headers();
  // read the custom x-url header
  const header_url = headersList.get("x-pathname");
  const session = await getServerAuthSession();
  if (!session) {
    redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
  }

  const yourGroups = await db.group.findMany({
    where: {
      OR: [
        { participants: { some: { userId: session.user.id } } },
        { adminId: session.user.id },
      ],
    },
    include: {
      participants: {
        include: { user: true },
      },
      admin: true,
    },
  });

  const yourGroupsFormatted = yourGroups.map((group) => ({
    ...group,
    participants: group.participants.map((participant) => ({
      ...participant,
      user: {
        image: participant.user.image,
      },
    })),
    isUserAnAdmin: group.adminId === session.user.id,
    dailyStreak: group.participants.find(
      (participant) => participant.userId === session.user.id,
    )?.dailyStreak,
  }));
  const discoverCarouselGroups = await db.group.findMany({
    where: {
      AND: [
        { isPrivate: false },
        { participants: { none: { userId: session.user.id } } },
      ],
    },
    include: {
      participants: {
        include: { user: true },
      },
      admin: true,
    },
    take: 4,
  });

  const discoverCarouselGroupsFormatted = discoverCarouselGroups.map(
    (group) => ({
      ...group,
      participants: group.participants.map((participant) => ({
        ...participant,
        user: {
          image: participant.user.image,
        },
      })),
      isUserAnAdmin: group.adminId === session.user.id,
      dailyStreak: group.participants.find(
        (participant) => participant.userId === session.user.id,
      )?.dailyStreak,
    }),
  );

  return (
    <main className="container pt-10">
      <YourGroups groups={yourGroupsFormatted} />
      <Discover groups={discoverCarouselGroupsFormatted} />
    </main>
  );
}

export default AppPage;