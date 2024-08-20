import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CopyToClipboard from "@/components/ui/copy-to-clipboard";
import AvatarCircles from "@/components/magicui/avatar-circles";
import {
  UsersRound,
  FrownIcon,
  MoveRight,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { type Group, type User, type GroupMembership } from "@prisma/client";

type GroupWithParticipants = Group & {
  participants: (GroupMembership & { user: User })[];
  admins: User[];
};

type YourGroupsProps = {
  groups: GroupWithParticipants[];
};

function YourGroups({ groups }: YourGroupsProps) {
  return (
    <>
      <div className="flex items-center justify-between">
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
      <div className="flex flex-wrap items-center justify-center gap-3">
        {groups.length > 0 ? (
          groups.map((group) => {
            const userMembership = group.participants[0];
            return (
              <Card key={group.id} className="w-[300px]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Link
                      href={`/group/${group.id}`}
                      className="flex items-center gap-x-2 text-primary"
                    >
                      {group.name}
                      <Badge variant="secondary">
                        {group.participants.length}{" "}
                        <UsersRound className="ms-1 h-4 w-4" />
                      </Badge>
                    </Link>
                    <div>
                      <CopyToClipboard
                        copyMessage="Copy Share Link"
                        href={`${process.env.NEXT_PUBLIC_APP_URL}/join/${group.id}`}
                      />
                    </div>
                  </CardTitle>
                  <Link href={`/group/${group.id}`}>
                    <CardDescription className="truncate">
                      {group.description}
                    </CardDescription>
                  </Link>
                </CardHeader>
                <Link href={`/group/${group.id}`}>
                  <CardContent>
                    <AvatarCircles
                      avatarUrls={group.participants
                        .slice(0, 4)
                        .map((p) => p.user.image ?? "")}
                      numPeople={group.participants.length - 4}
                    />
                  </CardContent>
                  <CardFooter>
                    <p>
                      Your Streak:{" "}
                      <span className="text-primary">
                        {userMembership?.dailyStreak ?? 0}
                      </span>
                    </p>
                  </CardFooter>
                </Link>
              </Card>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
              <FrownIcon className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Uh oh...
              </h1>
              <p className="mt-4 text-muted-foreground">
                Sounds like you don&apos;t have any groups.
              </p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <Button asChild variant="secondary">
                  <Link className="group" href="/app/discover">
                    Discover groups
                    <Search className="ms-1 h-5 w-5 transition-all group-hover:rotate-12" />
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
      </div>
    </>
  );
}

export default YourGroups;
