import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CopyToClipboard from "@/components/ui/copy-to-clipboard";
import AvatarCircles from "@/components/magicui/avatar-circles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UsersRound,
  FrownIcon,
  MoveRight,
  Search,
  Sparkles,
  MoreHorizontal,
  Pen,
  Trash,
  Earth,
  Lock,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import Link from "next/link";
import { deleteGroup } from "@/actions/groups";
import { type Group, type User, type GroupMembership } from "@prisma/client";
import { revalidatePath } from "next/cache";

type GroupWithParticipants = Group & {
  participants: (GroupMembership & { user: User })[];
  admin: User;
};

type YourGroupsProps = {
  groups: GroupWithParticipants[];
};

async function YourGroups({ groups }: YourGroupsProps) {
  const headersList = headers();
  // read the custom x-url header
  const header_url = headersList.get("x-pathname");
  const session = await getServerAuthSession();
  if (!session) {
    redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Groups</h1>
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/app/create"
            className="text-bold group text-sm text-primary hover:underline"
          >
            Create a group
            <MoveRight className="ms-1 inline h-5 w-5 transition-all group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {groups.length > 0 ? (
          groups.map((group) => {
            const userMembership = group.participants[0];
            return (
              <Card key={group.id} className="w-[400px] self-stretch">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Link
                      href={`/group/${group.id}`}
                      className="flex items-center gap-x-2 text-primary"
                    >
                      {group.name}
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            {group.isPrivate ? (
                              <Badge variant="secondary">
                                <Lock className="h-4 w-4 text-foreground" />
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Earth className="h-4 w-4 text-foreground" />
                              </Badge>
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            {group.isPrivate ? "Private" : "Public"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Badge variant="secondary">
                        {group.participants.length}
                        <UsersRound className="ms-1 h-4 w-4" />
                      </Badge>
                    </Link>
                    <div className="flex items-center gap-2">
                      <CopyToClipboard
                        copyMessage="Copy Share Link"
                        href={`${process.env.NEXTAUTH_URL}/join/${group.id}`}
                      />
                      {group.adminId === session.user.id ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-6 w-6 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/app/edit/${group.id}`}>
                                <Pen className="me-2 h-4 w-4" /> Edit Group
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Dialog>
                                <DialogTrigger className="relative flex cursor-pointer select-none items-center rounded-sm bg-destructive px-2 py-1.5 text-sm text-destructive-foreground outline-none transition-colors focus:bg-destructive/70 focus:text-destructive-foreground/70 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                  <Trash className="me-2 h-4 w-4" /> Delete
                                  Group
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Are you absolutely sure?
                                    </DialogTitle>
                                    <DialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete your account and remove
                                      your data from our servers.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter className="flex items-center justify-end">
                                    <DialogClose asChild>
                                      <Button variant="secondary">Close</Button>
                                    </DialogClose>
                                    <form
                                      action={async () => {
                                        "use server";
                                        await deleteGroup(group.id);
                                        revalidatePath("/app");
                                      }}
                                    >
                                      <Button
                                        type="submit"
                                        variant="destructive"
                                      >
                                        Delete Group
                                      </Button>
                                    </form>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <></>
                      )}
                    </div>
                  </CardTitle>
                  <Link href={`/group/${group.id}`}>
                    <CardDescription className="truncate">
                      {/* Put an invisibile span to adjust card height even if there's no description */}
                      {group.description} <span className="invisible">.</span>
                    </CardDescription>
                  </Link>
                </CardHeader>
                <Link href={`/group/${group.id}`}>
                  <CardContent>
                    <AvatarCircles
                      avatarUrls={group.participants
                        .slice(0, 4)
                        .map((p) => p.user.image ?? "")}
                      numPeople={group.participants.length - 4}
                    />
                  </CardContent>
                  <CardFooter>
                    <p>
                      Your Streak:{" "}
                      <span className="text-primary">
                        {userMembership?.dailyStreak ?? 0}
                      </span>
                    </p>
                  </CardFooter>
                </Link>
              </Card>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
              <FrownIcon className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Uh oh...
              </h1>
              <p className="mt-4 text-muted-foreground">
                Sounds like you don&apos;t have any groups.
              </p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <Button asChild variant="secondary">
                  <Link className="group" href="/app/discover">
                    Discover groups
                    <Search className="ms-1 h-5 w-5 transition-all group-hover:rotate-12" />
                  </Link>
                </Button>
                <Button asChild>
                  <Link className="group" href="/app/create">
                    Create a group
                    <Sparkles className="ms-1 h-5 w-5 transition-all group-hover:text-yellow-400 dark:group-hover:text-yellow-600" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default YourGroups;
