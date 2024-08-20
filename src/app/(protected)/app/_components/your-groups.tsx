import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CopyToClipboard from "@/components/ui/copy-to-clipboard";
import AvatarCircles from "@/components/magicui/avatar-circles";
import { UsersRound } from "lucide-react";
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
      <h1 className="text-center text-2xl font-bold lg:text-start">
        Your Groups
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {groups.map((group) => {
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
                    avatarUrls={group.participants.map(
                      (p) => p.user.image ?? "",
                    )}
                    numPeople={group.participants.length}
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
        })}
      </div>
    </>
  );
}

export default YourGroups;
