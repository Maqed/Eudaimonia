"use client";
import { useRef } from "react";
import type { FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { deleteAccountAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TransitionStartFunction } from "react";
type Props = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

function DeleteAccountSection({ isPending, startTransition }: Props) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const confirmDeleteName = useRef<HTMLInputElement | null>(null);
  const confirmDeleteMessage = useRef<HTMLInputElement | null>(null);
  async function deleteAccount(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const response = await deleteAccountAction();
      await signOut();
      router.push(DEFAULT_UNAUTHENTICATED_REDIRECT);
      toast({
        variant: "destructive",
        title: response.message ?? response.error,
      });
    });
  }
  return (
    <section>
      <h1 className="text-destructive text-3xl font-bold">Delete Account</h1>
      <hr className="my-2" />
      <p className="mb-2">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={isPending} variant="destructive">
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-y-3" onSubmit={deleteAccount}>
            <Label htmlFor="confirm-delete-name-input">
              Type your name
              <span className="text-foreground/80 italic">
                {session?.user.name}
              </span>
            </Label>
            <Input ref={confirmDeleteName} id="confirm-delete-name-input" />
            <Label htmlFor="confirm-delete-message-input">
              Confirm by typing this message
              <span className="text-foreground/80 italic">
                delete my account
              </span>
            </Label>
            <Input
              ref={confirmDeleteMessage}
              id="confirm-delete-message-input"
            />
            <div className="flex flex-wrap gap-x-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit" variant="destructive">
                Delete Account
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default DeleteAccountSection;
