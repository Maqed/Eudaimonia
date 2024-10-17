import { type Group, type User, type GroupMembership } from "@prisma/client";
import { type Session } from "next-auth";
import { type GroupCardProps } from "@/types/groups";
import { getServerAuthSession } from "@/server/auth";
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

export async function getYourGroups() {
  const session = await getServerAuthSession();
  const yourGroups = await db.group.findMany({
    where: {
      OR: [
        {
          participants: { some: { userId: session?.user.id, isBanned: false } },
        },
        { adminId: session?.user.id },
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
  take = Infinity,
  skip = 0,
}: {
  take?: number;
  skip?: number;
}) {
  const session = await getServerAuthSession();
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
