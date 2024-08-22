import { type Group, type User, type GroupMembership } from "@prisma/client";
export type GroupCardProps = Group & {
    participants: (GroupMembership & { user: { image: string | null } })[];
    admin: User;
    isUserAnAdmin: boolean;
};