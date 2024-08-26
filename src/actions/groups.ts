"use server";
import type * as z from "zod";
import { createOrEditGroupSchema } from "@/zod/groups";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { type Group, type User, type GroupMembership } from "@prisma/client";
import { type Session } from "next-auth";
import { type GroupCardProps } from "@/types/groups";
import { differenceInDays, isToday } from "date-fns";
import { pusherServer } from "@/pusher/server";

export async function createGroup(
  values: z.infer<typeof createOrEditGroupSchema>,
) {
  const validatedFields = createOrEditGroupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input" };
  }

  const session = await getServerAuthSession();
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const { name, description, isPrivate } = validatedFields.data;

  const group = await db.group.create({
    data: {
      name,
      description,
      isPrivate,
      admin: {
        connect: { id: session.user.id },
      },
      participants: {
        create: [
          {
            user: {
              connect: { id: session.user.id },
            },
          },
        ],
      },
    },
    include: {
      participants: true,
    },
  });

  return { success: true, group };
}

export async function editGroup(
  groupId: string,
  values: z.infer<typeof createOrEditGroupSchema>,
) {
  const validatedFields = createOrEditGroupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input" };
  }

  const session = await getServerAuthSession();
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const { name, description, isPrivate } = validatedFields.data;

  const group = await db.group.findUnique({
    where: { id: groupId },
    include: { admin: true },
  });

  if (!group) {
    return { error: "Group not found" };
  }

  if (group.adminId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const updatedGroup = await db.group.update({
    where: { id: groupId },
    data: {
      name,
      description,
      isPrivate,
    },
    include: {
      participants: true,
    },
  });

  return { success: true, group: updatedGroup };
}

export async function deleteGroup(groupId: string) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return { error: "Not authenticated" };
  }
  await db.group.delete({
    where: {
      id: groupId,
      adminId: session.user.id,
    },
  });
  return { success: true };
}

export async function joinGroup(groupId: string) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const group = await db.group.findUnique({
    where: { id: groupId },
    include: { participants: true },
  });

  if (!group) {
    return { error: "Group not found" };
  }

  const isAlreadyMember = group.participants.some(
    (p) => p.userId === session.user.id,
  );

  if (isAlreadyMember) {
    return { success: true };
  }

  await db.groupMembership.create({
    data: {
      user: { connect: { id: session.user.id } },
      group: { connect: { id: groupId } },
    },
  });

  return { success: true };
}

export async function leaveGroup(groupId: string) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const membership = await db.groupMembership.findUnique({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId: groupId,
      },
    },
  });

  if (!membership) {
    return { error: "Not a member of this group" };
  }

  if (membership.isBanned) {
    return { error: "You are banned from this group" };
  }

  await db.groupMembership.delete({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId: groupId,
      },
    },
  });

  return { success: true };
}

export async function banUser(groupId: string, userId: string) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const group = await db.group.findUnique({
    where: { id: groupId },
    include: { admin: true },
  });

  if (!group) {
    return { error: "Group not found" };
  }

  if (group.adminId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await db.groupMembership.update({
    where: {
      userId_groupId: {
        userId: userId,
        groupId: groupId,
      },
    },
    data: {
      isBanned: true,
    },
  });

  await pusherServer.trigger(groupId, "user-banned", { userId });

  return { success: true };
}

export async function unBanUser(groupId: string, userId: string) {
  const session = await getServerAuthSession();
  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const group = await db.group.findUnique({
    where: { id: groupId },
    include: { admin: true },
  });

  if (!group) {
    return { error: "Group not found" };
  }

  if (group.adminId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await db.groupMembership.update({
    where: {
      userId_groupId: {
        userId: userId,
        groupId: groupId,
      },
    },
    data: {
      isBanned: false,
    },
  });

  await pusherServer.trigger(groupId, "user-unbanned", { userId });

  return { success: true };
}

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

export async function completeHabit(userId: string, groupId: string) {
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

  const lastCompletedDate =
    membership.habitCompletedAt[membership.habitCompletedAt.length - 1];

  if (lastCompletedDate && isToday(lastCompletedDate)) {
    return { error: "Habit already completed today" };
  }

  const updatedMembership = await db.groupMembership.update({
    where: {
      userId_groupId: {
        userId,
        groupId,
      },
    },
    data: {
      habitCompletedAt: {
        push: new Date(),
      },
    },
  });

  return { success: true, membership: updatedMembership };
}
