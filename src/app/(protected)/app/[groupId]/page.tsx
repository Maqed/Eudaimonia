import { db } from "@/server/db";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isToday } from "date-fns";

import { completeHabit } from "@/actions/groups";
import { getDailyStreak } from "@/database/groups";
import { getMessages } from "@/actions/chat";

import CopyToClipboard from "@/components/ui/copy-to-clipboard";
import { Calendar } from "@/components/ui/calendar";
import { ConfettiSideCannons } from "@/components/ui/confetti-button-side";

import DailyStreak from "@/components/groups/daily-streak";
import ParticipantsBadge from "@/components/groups/participants-badge";
import GroupPrivacyBadge from "@/components/groups/privacy-badge";
import GroupAdminDropdown from "@/components/groups/group-admin-dropdown";
import GroupMemberDropdown from "@/components/groups/group-member-dropdown";
import JoinGroupButton from "@/components/groups/join-group-button";
import { Chat } from "@/components/chat/chat";
import Leaderboards from "@/components/groups/leaderboards";
import { checkIfLoggedIn } from "@/lib/server-utils";
import type { Metadata } from "next";

type Props = {
  params: { groupId: string };
};
export async function generateMetadata({ params: { groupId } }: Props) {
  const group = await db.group.findUnique({ where: { id: groupId } });
  if (!group) {
    notFound();
  }
  return {
    title: `${group.name}`,
    description: group.description,
  } satisfies Metadata;
}

async function GroupPage({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const { session } = await checkIfLoggedIn();

  const group = await db.group.findUnique({
    where: { id: groupId },
    include: {
      admin: true,
      participants: { include: { user: true } },
    },
  });

  if (!group) {
    return notFound();
  }

  const sessionParticipant = group.participants.find(
    (p) => p.userId === session.user.id,
  );

  if (sessionParticipant?.isBanned) {
    return notFound();
  }

  const participantsWithStreaks = await Promise.all(
    group.participants
      .filter((participant) => !participant.isBanned)
      .map(async (participant) => ({
        ...participant,
        dailyStreak:
          (await getDailyStreak(participant.userId, group.id)).dailyStreak ?? 0,
      })),
  );
  const { messages } = await getMessages({ groupId });

  const isMember = sessionParticipant && group.adminId !== session.user.id;
  const isAdmin = sessionParticipant && group.adminId === session.user.id;
  const isHabitCompleted =
    sessionParticipant &&
    isToday(sessionParticipant.habitCompletedAt.slice(-1)[0]!);

  const selectedUserWithGroup = sessionParticipant
    ? {
        ...sessionParticipant,
        group: {
          id: group.id,
          adminId: group.adminId,
        },
      }
    : undefined;

  return (
    <main className="container mt-10">
      <div className="flex items-center justify-between md:mb-5">
        <div className="flex items-center gap-x-2 text-primary">
          <h1 className="text-4xl font-bold">{group.name}</h1>
          <div className="hidden items-center justify-center gap-x-2 md:flex">
            <GroupPrivacyBadge isPrivate={group.isPrivate} />
            <ParticipantsBadge count={group.participants.length} />
          </div>
        </div>
        <div className="hidden items-center justify-center gap-2 md:flex">
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
      <div className="mb-5 flex items-center justify-end gap-2 md:hidden">
        <GroupPrivacyBadge isPrivate={group.isPrivate} />
        <ParticipantsBadge count={group.participants.length} />
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
        {sessionParticipant && (
          <div className="col-span-3 mb-10 h-[400px] lg:col-span-2">
            <h2 className="text-3xl font-bold">Chat</h2>
            <Chat
              selectedUser={selectedUserWithGroup}
              groupId={group.id}
              messages={messages}
            />
          </div>
        )}
        <div className="col-span-3">
          <h2 className="text-3xl font-bold">Leaderboards</h2>
          <Leaderboards participantsWithStreaks={participantsWithStreaks} />
        </div>
        <div className="col-span-3"></div>
      </div>
    </main>
  );
}

export default GroupPage;
