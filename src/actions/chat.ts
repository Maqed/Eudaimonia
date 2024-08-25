"use server";
import { db } from "@/server/db";
import { pusherServer } from "@/pusher/server";
import { getServerAuthSession } from "@/server/auth";

async function _isUserAuthorized(groupId: string) {
  const session = await getServerAuthSession();
  if (!session) {
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

  if (membership.isBanned) {
    return { error: "User is banned from this group" };
  }
  return { success: "User is Authenticated", session };
}

export async function sendMessage({
  content,
  groupId,
}: {
  content: string;
  groupId: string;
}) {
  const { session, error } = await _isUserAuthorized(groupId);
  if (error ?? !session) return { error };

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
  const { error } = await _isUserAuthorized(groupId);

  if (error) return { error };

  const messages = await db.message.findMany({
    where: {
      groupId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          groups: {
            where: { groupId },
            select: { isBanned: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const formattedMessages = messages.map((message) => ({
    ...message,
    isBanned: message.user.groups[0]?.isBanned ?? false, // Accessing the isBanned status
  }));
  return { success: true, messages: formattedMessages };
}

export async function deleteMessage({
  messageId,
  groupId,
}: {
  messageId: string;
  groupId: string;
}) {
  const { session, error } = await _isUserAuthorized(groupId);
  if (error ?? !session) return { error };
  const message = await db.message.findUnique({
    where: { id: messageId },
    include: { group: true },
  });

  if (!message) {
    return { error: "Message not found" };
  }

  if (
    message.userId !== session.user.id &&
    message.group.adminId !== session.user.id
  ) {
    return { error: "Unauthorized" };
  }

  await db.message.delete({
    where: { id: messageId },
  });

  await pusherServer.trigger(groupId, "message-deleted", { messageId });

  return { success: true };
}
