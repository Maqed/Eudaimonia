import Link from "next/link";
import { MoveRight } from "lucide-react";
import GroupCard from "@/components/groups/group-card";
import { type GroupCardProps } from "@/components/groups/group-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function Discover({ groups }: { groups: GroupCardProps[] }) {
  if (!groups.length) return null;
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Discover Groups</h1>
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/app/discover"
            className="text-bold group text-sm text-primary hover:underline"
          >
            See all
            <MoveRight className="ms-1 inline h-5 w-5 transition-all group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      <Carousel>
        <CarouselContent>
          {groups.map((group) => (
            <CarouselItem key={`discover-carousel-${group.id}`}>
              <GroupCard group={group} isUserJoined={false} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}

export default Discover;
