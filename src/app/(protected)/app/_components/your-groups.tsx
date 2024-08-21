import { Button } from "@/components/ui/button";

import { MoveRight, Search, Sparkles } from "lucide-react";

import Link from "next/link";
import GroupCard from "@/components/groups/group-card";
import { type GroupCardProps } from "@/types/groups";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

async function YourGroups({ groups }: { groups: GroupCardProps[] }) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Groups</h1>
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/app/create"
            className="text-bold group text-sm text-primary hover:underline"
          >
            Create a group
            <MoveRight className="ms-1 inline h-5 w-5 transition-all group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      {groups.length > 0 ? (
        <Carousel>
          <CarouselContent>
            {groups.map((group) => (
              <CarouselItem key={`discover-carousel-${group.id}`}>
                <GroupCard group={group} isUserJoined={true} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Sounds like you don&apos;t have any groups.
            </h1>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button asChild variant="secondary">
                <Link className="group" href="/app/discover">
                  Discover groups
                  <Search className="ms-1 h-5 w-5 transition-all group-hover:scale-110" />
                </Link>
              </Button>
              <Button asChild>
                <Link className="group" href="/app/create">
                  Create a group
                  <Sparkles className="ms-1 h-5 w-5 transition-all group-hover:text-yellow-400 dark:group-hover:text-yellow-600" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default YourGroups;
