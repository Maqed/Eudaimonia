"use server";
import type * as z from "zod";
import { createOrEditGroupSchema } from "@/zod/groups";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

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
