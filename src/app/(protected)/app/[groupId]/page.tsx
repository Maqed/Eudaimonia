import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";

import { getFirstLettersOfWords } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import CopyToClipboard from "@/components/ui/copy-to-clipboard";

import DailyStreak from "@/components/groups/daily-streak";
import ParticipantsBadge from "@/components/groups/participants-badge";
import GroupPrivacyBadge from "@/components/groups/privacy-badge";
import GroupAdminDropdown from "@/components/groups/group-admin-dropdown";
import GroupMemberDropdown from "@/components/groups/group-member-dropdown";
import JoinGroupButton from "@/components/groups/join-group-button";


async function GroupPage({ params: { groupId } }: { params: { groupId: string } }) {
    const headersList = headers();
    // read the custom x-url header
    const header_url = headersList.get("x-pathname");
    const session = await getServerAuthSession();
    if (!session) {
        redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
    }
    const group = await db.group.findUnique({
        where: { id: groupId },
        include: { admin: true, participants: { include: { user: true } } },
    });

    if (!group) {
        notFound();
    }
    const sessionParticipant = group.participants.find((participant) => participant.userId === session.user.id)
    const isMember = sessionParticipant && group.adminId !== session.user.id;
    const isAdmin = sessionParticipant && group.adminId === session.user.id;
    return (
        <main className="container mt-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2 text-primary">
                    <h1 className="text-4xl font-bold">{group.name}</h1>
                    <GroupPrivacyBadge isPrivate={group.isPrivate} />
                    <ParticipantsBadge count={group.participants.length} />
                </div>
                <div className="flex items-center justify-center gap-2">
                    <DailyStreak streak={sessionParticipant?.dailyStreak ?? 0} />
                    <CopyToClipboard
                        copyMessage="Copy Share Link"
                        href={`${process.env.NEXTAUTH_URL}/join/${group.id}`}
                    />
                    {!sessionParticipant && <JoinGroupButton groupId={group.id} />}
                    {isMember && <GroupMemberDropdown groupId={group.id} />}
                    {isAdmin && <GroupAdminDropdown groupId={group.id} />}
                </div>
            </div>
            <h2 className="text-3xl font-bold">Leaderboards</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead >#</TableHead >
                        <TableHead >Name</TableHead >
                        <TableHead >Daily Streak</TableHead >
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {group.participants
                        .sort((a, b) => b.dailyStreak - a.dailyStreak)
                        .map((member, index) => {
                            const rank = index + 1
                            const rankColors = cn('font-bold',
                                { "text-[#b59410] dark:text-[#FFD700]": rank === 1 },
                                { "text-[#6D6C71] dark:text-[#C0C0C0]": rank === 2 },
                                { "text-[#a05822]": rank === 3 },

                            )
                            return <TableRow key={`leaderboard-${member.userId}`}>
                                <TableCell className={
                                    rankColors
                                }>{rank}</TableCell>
                                <TableCell className="flex justify-start items-center gap-2 flex-row"><Avatar>
                                    <AvatarImage src={member.user.image ?? ''} />
                                    <AvatarFallback>{getFirstLettersOfWords(member.user.name)}</AvatarFallback>
                                </Avatar>{member.user.name}</TableCell>
                                <TableCell className={
                                    rankColors
                                }>{member.dailyStreak}</TableCell>
                            </TableRow>
                        })}
                </TableBody>
            </Table>
        </main>
    );
}

export default GroupPage;