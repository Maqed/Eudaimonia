import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { leaveGroup } from "@/actions/groups";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { MoreHorizontal, LogOut } from "lucide-react";

function GroupMemberDropdown({ groupId }: { groupId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-6 w-6 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger className="relative flex cursor-pointer select-none items-center rounded-sm bg-destructive px-2 py-1.5 text-sm text-destructive-foreground outline-none transition-colors focus:bg-destructive/70 focus:text-destructive-foreground/70 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <LogOut className="me-2 h-4 w-4" /> Leave Group
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  You&apos;ll leave the group and all of your activity will be
                  deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex items-center justify-end">
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
                <form
                  action={async () => {
                    "use server";
                    await leaveGroup(groupId);
                    revalidatePath("/app");
                    redirect('/app')
                  }}
                >
                  <Button type="submit" variant="destructive">
                    Leave Group
                  </Button>
                </form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GroupMemberDropdown;
