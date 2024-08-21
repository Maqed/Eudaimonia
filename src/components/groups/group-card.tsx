import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";
import Link from "next/link";

import { type GroupCardProps } from "@/types/groups";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CopyToClipboard from "@/components/ui/copy-to-clipboard";
import AvatarCircles from "@/components/magicui/avatar-circles";

import DailyStreak from "./daily-streak";
import ParticipantsBadge from "./participants-badge";
import GroupPrivacyBadge from "./privacy-badge";
import GroupAdminDropdown from "./group-admin-dropdown";
import GroupMemberDropdown from "./group-member-dropdown";
import JoinGroupButton from "./join-group-button";

async function GroupCard({
  group,
  isUserJoined,
}: {
  group: GroupCardProps;
  isUserJoined: boolean;
}) {
  const headersList = headers();
  const header_url = headersList.get("x-pathname");
  const session = await getServerAuthSession();
  if (!session) {
    redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
  }

  const isAdmin = isUserJoined && group.adminId === session.user.id;
  const isMember = isUserJoined && group.adminId !== session.user.id;
  const groupLink = isUserJoined ? `/group/${group.id}` : `/join/${group.id}`;

  return (
    <Card key={group.id} className="w-[400px] self-stretch">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link href={groupLink} className="flex items-center gap-x-2 text-primary">
            {group.name}
            <GroupPrivacyBadge isPrivate={group.isPrivate} />
            <ParticipantsBadge count={group.participants.length} />
          </Link>
          <div className="flex items-center gap-2">
            <CopyToClipboard
              copyMessage="Copy Share Link"
              href={`${process.env.NEXTAUTH_URL}/join/${group.id}`}
            />
            {isAdmin && <GroupAdminDropdown group={group} />}
            {isMember && <GroupMemberDropdown group={group} />}
          </div>
        </CardTitle>
        <Link href={groupLink}>
          <CardDescription className="truncate">
            {group.description} <span className="invisible">.</span>
          </CardDescription>
        </Link>
      </CardHeader>
      <Link href={groupLink}>
        <CardContent>
          <AvatarCircles
            avatarUrls={group.participants.slice(0, 4).map((p) => p.user.image ?? "")}
            numPeople={group.participants.length - 4}
          />
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between">
        <DailyStreak streak={group.dailyStreak ?? 0} />
        {!isUserJoined && (
          <JoinGroupButton groupId={group.id} />
        )}
      </CardFooter>
    </Card>
  );
}

export default GroupCard;