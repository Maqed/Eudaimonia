import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLettersOfWords } from "@/lib/utils";
import { cn } from "@/lib/utils";
export type ParticipantsWithStreaksType = {
  dailyStreak: number;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
  };
  id: string;
  userId: string;
  groupId: string;
  joinedAt: Date;
  habitCompletedAt: Date[];
  isBanned: boolean;
}[];
function Leaderboards({
  participantsWithStreaks,
}: {
  participantsWithStreaks: ParticipantsWithStreaksType;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Daily Streak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participantsWithStreaks
          .sort((a, b) => b.dailyStreak - a.dailyStreak)
          .map((member, index) => {
            const rank = index + 1;
            const rankColors = cn(
              "font-bold",
              { "text-[#b59410] dark:text-[#FFD700]": rank === 1 },
              { "text-[#6D6C71] dark:text-[#C0C0C0]": rank === 2 },
              { "text-[#a05822]": rank === 3 },
            );
            return (
              <TableRow key={`leaderboard-${member.userId}`}>
                <TableCell className={rankColors}>{rank}</TableCell>
                <TableCell className="flex flex-row items-center justify-start gap-2">
                  <Avatar>
                    <AvatarImage src={member.user.image ?? ""} />
                    <AvatarFallback>
                      {getFirstLettersOfWords(member.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  {member.user.name}
                </TableCell>
                <TableCell className={rankColors}>
                  {member.dailyStreak}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}

export default Leaderboards;
