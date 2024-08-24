"use server";
import { db } from "@/server/db";
import { pusherServer } from "@/pusher/server";
import { getServerAuthSession } from "@/server/auth";

export async function sendMessage({
  content,
  groupId,
}: {
  content: string;
  groupId: string;
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return { error: "Not authenticated" };
  }
  if (!content) {
    return { error: "Invalid content" };
  }
  const group = await db.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) {
    return { error: "Group doesn't exist" };
  }

  const sentMessage = await db.message.create({
    data: {
      content,
      groupId,
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // Ensure this is only called once
  await pusherServer.trigger(groupId, "incoming-message", sentMessage);

  return { success: true, sentMessage };
}

export async function getMessages({ groupId }: { groupId: string }) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  const membership = await db.groupMembership.findUnique({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId,
      },
    },
  });

  if (!membership) {
    return { error: "User is not a member of this group" };
  }

  const messages = await db.message.findMany({
    where: {
      groupId,
    },
    include: { user: true },
  });

  return { success: true, messages };
}
