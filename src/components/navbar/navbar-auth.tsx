"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { getFirstLettersOfWords } from "@/lib/utils";
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function NavbarAuth() {
  const { data: session, status } = useSession();
  if (status === "loading")
    return <Skeleton className="h-10 w-10 rounded-full" />;

  console.log(session?.user.image);
  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={session.user.image} />
          <AvatarFallback>
            {getFirstLettersOfWords(session.user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Hello {session.user.name} 👋</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/user-settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      <Button size="sm" asChild>
        <Link href="/login">Login</Link>
      </Button>
    </>
  );
}

export default NavbarAuth;
