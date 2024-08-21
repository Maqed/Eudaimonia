import { revalidatePath } from "next/cache";
import Link from "next/link";
import { deleteGroup } from "@/actions/groups";
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
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import { type GroupCardProps } from "@/types/groups";

function GroupAdminDropdown({ group }: { group: GroupCardProps }) {
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
          <Link href={`/app/edit/${group.id}`}>
            <Pen className="me-2 h-4 w-4" /> Edit Group
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger className="relative flex cursor-pointer select-none items-center rounded-sm bg-destructive px-2 py-1.5 text-sm text-destructive-foreground outline-none transition-colors focus:bg-destructive/70 focus:text-destructive-foreground/70 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <Trash className="me-2 h-4 w-4" /> Delete Group
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
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
                  <Button type="submit" variant="destructive">
                    Delete Group
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

export default GroupAdminDropdown;
