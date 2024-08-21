import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";
import { type Group, type User, type GroupMembership } from "@prisma/client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CopyToClipboard from "@/components/ui/copy-to-clipboard";
import AvatarCircles from "@/components/magicui/avatar-circles";

import { UsersRound, Earth, Lock, Flame } from "lucide-react";
import GroupAdminDropdown from "./group-admin-dropdown";

type GroupWithParticipants = Group & {
  participants: (GroupMembership & { user: User })[];
  admin: User;
};

type GroupProps = {
  group: GroupWithParticipants;
};
async function GroupCard({ group }: GroupProps) {
  const headersList = headers();

  // read the custom x-url header
  const header_url = headersList.get("x-pathname");
  const session = await getServerAuthSession();
  if (!session) {
    redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
  }

  const userMembership = group.participants[0];
  return (
    <Card key={group.id} className="w-[400px] self-stretch">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link
            href={`/group/${group.id}`}
            className="flex items-center gap-x-2 text-primary"
          >
            {group.name}
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  {group.isPrivate ? (
                    <Badge variant="secondary">
                      <Lock className="h-4 w-4 text-foreground" />
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Earth className="h-4 w-4 text-foreground" />
                    </Badge>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {group.isPrivate ? "Private" : "Public"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Badge variant="secondary">
              {group.participants.length}
              <UsersRound className="ms-1 h-4 w-4" />
            </Badge>
          </Link>
          <div className="flex items-center gap-2">
            <CopyToClipboard
              copyMessage="Copy Share Link"
              href={`${process.env.NEXTAUTH_URL}/join/${group.id}`}
            />
            {group.adminId === session.user.id ? <GroupAdminDropdown group={group} /> : <></>}
          </div>
        </CardTitle>
        <Link href={`/group/${group.id}`}>
          <CardDescription className="truncate">
            {/* Put an invisibile span to adjust card height even if there's no description */}
            {group.description} <span className="invisible">.</span>
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
          <div className="flex items-center justify-center gap-1 text-lg text-orange-600">
            <b>{userMembership?.dailyStreak ?? 0}</b>
            <Flame className="inline h-7 w-7 fill-current" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}

export default GroupCard;
