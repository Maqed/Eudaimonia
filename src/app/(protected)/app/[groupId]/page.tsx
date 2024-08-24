import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { isToday } from "date-fns";

import { getDailyStreak, completeHabit } from "@/actions/groups";

import { getFirstLettersOfWords } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CopyToClipboard from "@/components/ui/copy-to-clipboard";
import { Calendar } from "@/components/ui/calendar";
import { ConfettiSideCannons } from "@/components/ui/confetti-button-side";

import DailyStreak from "@/components/groups/daily-streak";
import ParticipantsBadge from "@/components/groups/participants-badge";
import GroupPrivacyBadge from "@/components/groups/privacy-badge";
import GroupAdminDropdown from "@/components/groups/group-admin-dropdown";
import GroupMemberDropdown from "@/components/groups/group-member-dropdown";
import JoinGroupButton from "@/components/groups/join-group-button";

async function GroupPage({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const headersList = headers();
  // read the custom x-url header
  const header_url = headersList.get("x-pathname");
  const session = await getServerAuthSession();
  if (!session) {
    redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
  }
  const group = await db.group.findUnique({
    where: { id: groupId },
    include: { admin: true, participants: { include: { user: true } } },
  });

  if (!group) {
    notFound();
  }
  // Add dailyStreak to each participant
  const groupWithParticipantsWithDailyStreak = {
    ...group,
    participants: await Promise.all(
      group.participants.map(async (participant) => ({
        ...participant,
        dailyStreak:
          (await getDailyStreak(participant.userId, group.id)).dailyStreak ?? 0,
      })),
    ),
  };

  const sessionParticipant = group.participants.find(
    (participant) => participant.userId === session.user.id,
  );
  const isMember = sessionParticipant && group.adminId !== session.user.id;
  const isAdmin = sessionParticipant && group.adminId === session.user.id;
  const isHabitCompleted =
    sessionParticipant &&
    isToday(
      sessionParticipant.habitCompletedAt[
        sessionParticipant.habitCompletedAt.length - 1
      ]!,
    );
  return (
    <main className="container mt-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2 text-primary">
          <h1 className="text-4xl font-bold">{group.name}</h1>
          <GroupPrivacyBadge isPrivate={group.isPrivate} />
          <ParticipantsBadge count={group.participants.length} />
        </div>
        <div className="flex items-center justify-center gap-2">
          <DailyStreak
            streak={
              (await getDailyStreak(session.user.id, group.id)).dailyStreak ?? 0
            }
          />
          <CopyToClipboard
            copyMessage="Copy Share Link"
            href={`${process.env.NEXTAUTH_URL}/join/${group.id}`}
          />
          {!sessionParticipant && <JoinGroupButton groupId={group.id} />}
          {isMember && <GroupMemberDropdown groupId={group.id} />}
          {isAdmin && <GroupAdminDropdown groupId={group.id} />}
        </div>
      </div>
      {sessionParticipant && (
        <form
          action={async () => {
            "use server";
            await completeHabit(session.user.id, group.id);
            revalidatePath(`/app/${group.id}`);
            redirect(`/app/${group.id}`);
          }}
        >
          <ConfettiSideCannons
            type="submit"
            disabled={isHabitCompleted}
            className="my-3 w-full"
          >
            {isHabitCompleted ? "Habit is completed today!" : "Complete Habit!"}
          </ConfettiSideCannons>
        </form>
      )}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {sessionParticipant && (
          <div className="place-self-center">
            <h2 className="text-center text-3xl font-bold">Track your habit</h2>
            <Calendar
              mode="multiple"
              disabled
              selected={sessionParticipant.habitCompletedAt}
            />
          </div>
        )}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold">Leaderboards</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Daily Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupWithParticipantsWithDailyStreak.participants
                .sort((a, b) => b.dailyStreak - a.dailyStreak)
                .map((member, index) => {
                  const rank = index + 1;
                  const rankColors = cn(
                    "font-bold",
                    { "text-[#b59410] dark:text-[#FFD700]": rank === 1 },
                    { "text-[#6D6C71] dark:text-[#C0C0C0]": rank === 2 },
                    { "text-[#a05822]": rank === 3 },
                  );
                  return (
                    <TableRow key={`leaderboard-${member.userId}`}>
                      <TableCell className={rankColors}>{rank}</TableCell>
                      <TableCell className="flex flex-row items-center justify-start gap-2">
                        <Avatar>
                          <AvatarImage src={member.user.image ?? ""} />
                          <AvatarFallback>
                            {getFirstLettersOfWords(member.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        {member.user.name}
                      </TableCell>
                      <TableCell className={rankColors}>
                        {member.dailyStreak}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

export default GroupPage;
