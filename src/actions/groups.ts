"use server";
import type * as z from "zod";
import { createOrEditGroupSchema } from "@/zod/groups";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { type Group, type User, type GroupMembership } from "@prisma/client";
import { type Session } from "next-auth";
import { type GroupCardProps } from '@/types/groups'

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

  const group = await db.group.findUnique({
    where: { id: groupId },
    include: { participants: true },
  });

  if (!group) {
    return { error: "Group not found" };
  }

  const isMember = group.participants.some((p) => p.userId === session.user.id);

  if (!isMember) {
    return { success: true };
  }

  await db.groupMembership.deleteMany({
    where: {
      userId: session.user.id,
      groupId: groupId,
    },
  });

  return { success: true };
}

type groupsType = Group & {
  participants: (GroupMembership & { user: { image: string | null } })[];
  admin: User;
}

function _formatToGroupCard(groups: groupsType[], session: Session): GroupCardProps[] {
  return groups.map((group) => ({
    ...group,
    participants: group.participants.map((participant) => ({
      ...participant,
      user: {
        image: participant.user.image,
      },
    })),
    isUserAnAdmin: group.adminId === session?.user.id,
    dailyStreak: group.participants.find(
      (participant) => participant.userId === session?.user.id,
    )?.dailyStreak,
  }));
}

export async function getYourGroups(session: Session) {
  const yourGroups = await db.group.findMany({
    where: {
      OR: [
        { participants: { some: { userId: session.user.id } } },
        { adminId: session.user.id },
      ],
    },
    include: {
      participants: {
        include: { user: true },
      },
      admin: true,
    },
  });
  return _formatToGroupCard(yourGroups, session)
}

export async function getDiscoverGroups({
  session, take = Infinity, skip = 0
}: { session: Session, take?: number, skip?: number }) {
  const discoverCarouselGroups = await db.group.findMany({
    where: {
      AND: [
        { isPrivate: false },
        { participants: { none: { userId: session.user.id } } },
      ],
    },
    include: {
      participants: {
        include: { user: true },
      },
      admin: true,
    },
    take,
    skip
  });
  return _formatToGroupCard(discoverCarouselGroups, session)
}