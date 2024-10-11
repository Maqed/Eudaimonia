import { db } from "@/server/db";
import { PaginationWithLinks } from "@/components/ui/paginationWithLinks";
import GroupCard from "@/components/groups/group-card";
import { getDiscoverGroups } from "@/database/groups";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { checkIfLoggedIn } from "@/lib/server-utils";
import CreateAGroupButton from "@/components/groups/create-a-group-button";
import { env } from "process";
import { Metadata } from "next";

const title = "Discover";
const description = "Discover Public Groups";

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

const pageSize = 6;

type Props = {
  searchParams: {
    page: string | number;
  };
};

async function DiscoverPage({ searchParams: { page } }: Props) {
  page = Number(page) || 1;
  const { session } = await checkIfLoggedIn();

  const discoverCarouselGroups = await getDiscoverGroups({

    take: pageSize,
    skip: pageSize * (page - 1),
  });

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
        <Suspense
          fallback={
            <>
              <Skeleton className="h-[228px] w-[400px]" />
              <Skeleton className="h-[228px] w-[400px]" />
              <Skeleton className="h-[228px] w-[400px]" />
              <Skeleton className="h-[228px] w-[400px]" />
              <Skeleton className="h-[228px] w-[400px]" />
              <Skeleton className="h-[228px] w-[400px]" />
            </>
          }
        >
          {discoverCarouselGroups.length > 0 ? (
            discoverCarouselGroups.map((group) => {
              return (
                <GroupCard
                  key={`discover-${group.id}`}
                  group={group}
                  isUserJoined={false}
                />
              );
            })
          ) : (
            <>
              <div className="flex w-full flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    There&apos;s no groups to discover
                  </h1>
                  <div className="mt-6">
                    <CreateAGroupButton />
                  </div>
                </div>
              </div>
            </>
          )}
        </Suspense>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        }
      >
        <PaginationWithLinks
          page={page}
          pageSize={pageSize}
          totalCount={totalNumberOfGroups}
        />
      </Suspense>
    </main>
  );
}

export default DiscoverPage;
