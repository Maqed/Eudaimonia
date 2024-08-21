import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";
import { PaginationWithLinks } from "@/components/ui/paginationWithLinks";
import GroupCard from "@/components/groups/group-card";
import { getDiscoverGroups } from "@/actions/groups";

const pageSize = 6;

type Props = {
  searchParams: {
    page: string | number;
  };
};

async function DiscoverPage({ searchParams: { page } }: Props) {
  page = Number(page) || 1;
  const headersList = headers();
  // read the custom x-url header
  const header_url = headersList.get("x-pathname");
  const session = await getServerAuthSession();
  if (!session) {
    redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
  }

  const discoverCarouselGroups = await getDiscoverGroups({
    session, take: pageSize,
    skip: pageSize * (page - 1),
  })

  const totalNumberOfGroups = await db.group.count({
    where: {
      AND: [
        { isPrivate: false },
        { participants: { none: { userId: session.user.id } } },
      ],
    },
  });

  return (
    <main className="container mt-10">
      <h1 className="mb-5 text-4xl">Discover Groups</h1>
      <div className="mb-5 flex flex-wrap items-center justify-start gap-3">
        {discoverCarouselGroups.map((group) => {
          return (
            <GroupCard
              key={`discover-${group.id}`}
              group={group}
              isUserJoined={false}
            />
          );
        })}
      </div>
      <PaginationWithLinks
        page={page}
        pageSize={pageSize}
        totalCount={totalNumberOfGroups}
      />
    </main>
  );
}

export default DiscoverPage;
