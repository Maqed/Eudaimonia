import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CopyToClipboard from "@/components/ui/copy-to-clipboard";
import AvatarCircles from "@/components/magicui/avatar-circles";
import { UsersRound } from "lucide-react";
import Link from "next/link";

function YourGroups() {
  return (
    <>
      <h1 className="text-center text-2xl font-bold lg:text-start">
        Your Groups
      </h1>
      <div className="flex items-center justify-center gap-3">
        <Card className="w-[300px]">
          <CardHeader>
            {/* Use actual data */}
            <CardTitle className="flex items-center justify-between">
              <Link
                href="/group/1"
                className="flex items-center gap-x-2 text-primary"
              >
                Title
                <Badge variant="secondary">
                  10 <UsersRound className="ms-1 h-4 w-4" />
                </Badge>
              </Link>
              <div>
                <CopyToClipboard
                  copyMessage="Copy Share Link"
                  href={`${process.env.NEXTAUTH_URL}/join/1`}
                />
              </div>
            </CardTitle>
            <Link href="/group/1">
              <CardDescription className="truncate">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel,
                neque. Quos itaque veniam ipsa aperiam! Ipsam est natus odit,
                animi officiis quibusdam earum, assumenda sapiente, sequi facere
                deserunt in sed!
              </CardDescription>
            </Link>
          </CardHeader>
          <Link href="/group/1">
            <CardContent>
              <AvatarCircles avatarUrls={[]} numPeople={10} />
            </CardContent>
            <CardFooter>
              <p>
                Your Streak: <span className="text-primary">100</span>
              </p>
            </CardFooter>
          </Link>
        </Card>
      </div>
    </>
  );
}

export default YourGroups;
