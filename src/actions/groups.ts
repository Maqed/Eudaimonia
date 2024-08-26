"use server";
import type * as z from "zod";
import { createOrEditGroupSchema } from "@/zod/groups";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { isToday } from "date-fns";
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
