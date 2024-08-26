import { type Group, type User, type GroupMembership } from "@prisma/client";
import { type Session } from "next-auth";
import { type GroupCardProps } from "@/types/groups";
import { differenceInDays, isToday } from "date-fns";
import { db } from "@/server/db";

type groupsType = Group & {
  participants: (GroupMembership & { user: { image: string | null } })[];
  admin: User;
};

function _formatToGroupCard(
  groups: groupsType[],
  session: Session | null,
): GroupCardProps[] {
  return groups.map((group) => ({
    ...group,
    participants: group.participants.map((participant) => ({
      ...participant,
      user: {
        image: participant.user.image,
      },
    })),
    isUserAnAdmin: session ? group.adminId === session?.user.id : false,
  }));
}

export async function getYourGroups(session: Session) {
  const yourGroups = await db.group.findMany({
    where: {
      OR: [
        {
          participants: { some: { userId: session.user.id, isBanned: false } },
        },
        { adminId: session.user.id },
      ],
    },
    include: {
      participants: {
        where: { isBanned: false },
        include: { user: true },
      },
      admin: true,
    },
  });
  return _formatToGroupCard(yourGroups, session);
}

export async function getDiscoverGroups({
  session,
  take = Infinity,
  skip = 0,
}: {
  session: Session | null;
  take?: number;
  skip?: number;
}) {
  const discoverCarouselGroups = await db.group.findMany({
    where: {
      AND: [
        { isPrivate: false },
        ...(session
          ? [
              {
                participants: {
                  none: {
                    OR: [{ userId: session.user.id }, { isBanned: true }],
                  },
                },
              },
            ]
          : []),
      ],
    },
    include: {
      participants: {
        where: { isBanned: false },
        include: { user: true },
      },
      admin: true,
    },
    take,
    skip,
  });
  return _formatToGroupCard(discoverCarouselGroups, session);
}

export async function getDailyStreak(userId: string, groupId: string) {
  const membership = await db.groupMembership.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId,
      },
    },
    select: {
      habitCompletedAt: true,
    },
  });

  if (!membership) {
    return { error: "Membership not found" };
  }
  if (membership.habitCompletedAt.length === 0) {
    return { success: true, dailyStreak: 0 };
  }

  const lastCompletedDate =
    membership.habitCompletedAt[
      membership.habitCompletedAt.length - 1
    ]?.toLocaleDateString();

  if (
    !lastCompletedDate ||
    (!isToday(lastCompletedDate) &&
      differenceInDays(new Date().toLocaleDateString(), lastCompletedDate) !==
        1)
  ) {
    return { success: true, dailyStreak: 0 };
  }

  if (
    (isToday(lastCompletedDate) ||
      differenceInDays(new Date().toLocaleDateString(), lastCompletedDate) ===
        1) &&
    membership.habitCompletedAt.length === 1
  ) {
    return { success: true, dailyStreak: 1 };
  }
  let streak = 1;

  for (let i = membership.habitCompletedAt.length - 1; i >= 1; i--) {
    const diff = differenceInDays(
      membership.habitCompletedAt[i]?.toLocaleDateString() ?? "",
      membership.habitCompletedAt[i - 1]?.toLocaleDateString() ?? "",
    ); // Use non-null assertion (!)
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return { success: true, dailyStreak: streak };
}
