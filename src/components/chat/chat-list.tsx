"use client";
import { type Message, type User } from "@prisma/client";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal, Trash, Ban } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { deleteMessage } from "@/actions/chat";
import { banUser, unBanUser } from "@/actions/groups";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type MessageType = Message & {
  user: Partial<User>;
} & { isBanned: boolean };
export type selectedUserType =
  | {
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
      id: string;
      userId: string;
      groupId: string;
      joinedAt: Date;
      habitCompletedAt: Date[];
      group: {
        id: string;
        adminId: string;
      };
    }
  | undefined;

interface ChatListProps {
  messages?: MessageType[];
  selectedUser: selectedUserType;
  groupId: string;
}

export function ChatList({ messages, selectedUser, groupId }: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);

  React.useEffect(() => {
    if (
      messagesContainerRef.current &&
      messagesContainerRef.current.scrollHeight -
        messagesContainerRef.current.scrollTop <=
        474
    ) {
      console.log(
        messagesContainerRef.current.scrollHeight -
          messagesContainerRef.current.scrollTop,
      );
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage({ messageId, groupId });
    setOpenMessageId(null);
  };

  const handleBanUser = async (userId: string) => {
    await banUser(groupId, userId);
    setOpenMessageId(null);
  };

  const handleUnBanUser = async (userId: string) => {
    await unBanUser(groupId, userId);
    setOpenMessageId(null);
  };

  if (!selectedUser) return <></>;

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      <div
        ref={messagesContainerRef}
        className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages?.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex gap-2 whitespace-pre-wrap p-4",
                message.userId === selectedUser.userId
                  ? "flex-row-reverse"
                  : "flex-row justify-start",
              )}
            >
              <Avatar className="flex items-center justify-center">
                <AvatarImage
                  src={message.user.image ?? ""}
                  alt={message.user.name ?? ""}
                  width={6}
                  height={6}
                />
              </Avatar>
              <span className="max-w-xs rounded-md bg-accent p-3">
                {message.content}
              </span>
              <div className="self-center justify-self-center">
                {selectedUser.user.id === message.userId && (
                  <SelectedUserDropdownMenu
                    messageId={message.id}
                    handleDeleteMessage={handleDeleteMessage}
                    isOpen={openMessageId === message.id}
                    onOpenChange={(open) =>
                      setOpenMessageId(open ? message.id : null)
                    }
                  />
                )}
                {selectedUser.group.adminId === selectedUser.user.id &&
                  message.userId !== selectedUser.user.id && (
                    <AdminDropdownMenu
                      messageId={message.id}
                      userId={message.userId}
                      handleBanUser={handleBanUser}
                      handleUnBanUser={handleUnBanUser}
                      handleDeleteMessage={handleDeleteMessage}
                      isOpen={openMessageId === message.id}
                      onOpenChange={(open) =>
                        setOpenMessageId(open ? message.id : null)
                      }
                      isBanned={message.isBanned}
                    />
                  )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar groupId={groupId} />
    </div>
  );
}
function DeleteMessageDialog({
  messageId,
  handleDeleteMessage,
}: {
  messageId: string;
  handleDeleteMessage: (messageId: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const handleDelete = async () => {
    await handleDeleteMessage(messageId);
    toast({
      variant: "success",
      title: "Message has been deleted successfully!",
    });
  };

  return (
    <DropdownMenuItem asChild>
      <Dialog>
        <DialogTrigger className="relative flex cursor-pointer select-none items-center rounded-sm bg-destructive px-2 py-1.5 text-sm text-destructive-foreground outline-none transition-colors">
          <Trash className="me-1" size={16} /> Delete Message
        </DialogTrigger>
        <DialogContent className="max-h-[400px] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete the message
            </DialogTitle>
            <DialogDescription>
              The message will be deleted from our server database
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
            <Button onClick={handleDelete} type="submit" variant="destructive">
              Delete Message <Trash className="ms-1" size={16} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenuItem>
  );
}
function BanUserDropdownItem({
  userId,
  handleBanUser,
}: {
  userId: string;
  handleBanUser: (userId: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const handleBan = async () => {
    await handleBanUser(userId);
    router.refresh();
    toast({
      variant: "success",
      title: "User has been banned successfully!",
    });
  };

  return (
    <DropdownMenuItem asChild>
      <Dialog>
        <DialogTrigger className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <Ban className="me-1" size={16} /> Ban
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to ban this user</DialogTitle>
            <DialogDescription>
              The user will be banned from the group
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
            <Button onClick={handleBan} type="submit" className="text-white">
              Ban User <Ban className="ms-1" size={16} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenuItem>
  );
}
function UnBanUserDropdownItem({
  userId,
  handleUnBanUser,
}: {
  userId: string;
  handleUnBanUser: (userId: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const handleUnBan = async () => {
    await handleUnBanUser(userId);
    router.refresh();
    toast({
      variant: "success",
      title: "User has been unbanned successfully!",
    });
  };

  return (
    <DropdownMenuItem asChild>
      <Dialog>
        <DialogTrigger className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <Ban className="me-1" size={16} /> Unban
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to unban this user</DialogTitle>
            <DialogDescription>
              The user will be unbanned from the group
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
            <Button onClick={handleUnBan} type="submit" className="text-white">
              Unban User <Ban className="ms-1" size={16} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenuItem>
  );
}
function SelectedUserDropdownMenu({
  messageId,
  handleDeleteMessage,
  isOpen,
  onOpenChange,
}: {
  messageId: string;
  handleDeleteMessage: (messageId: string) => Promise<void>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-6 w-6 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DeleteMessageDialog
          messageId={messageId}
          handleDeleteMessage={handleDeleteMessage}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function AdminDropdownMenu({
  messageId,
  handleDeleteMessage,
  handleBanUser,
  handleUnBanUser,
  userId,
  isOpen,
  onOpenChange,
  isBanned: isBannedInitialValue,
}: {
  messageId: string;
  handleDeleteMessage: (messageId: string) => Promise<void>;
  handleBanUser: (userId: string) => Promise<void>;
  handleUnBanUser: (userId: string) => Promise<void>;
  userId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isBanned: boolean;
}) {
  const [isBanned, setIsBanned] = useState(isBannedInitialValue);
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-6 w-6 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isBanned ? (
          <UnBanUserDropdownItem
            userId={userId}
            handleUnBanUser={async (userId) => {
              await handleUnBanUser(userId);
              setIsBanned(false);
            }}
          />
        ) : (
          <BanUserDropdownItem
            userId={userId}
            handleBanUser={async (userId) => {
              await handleBanUser(userId);
              setIsBanned(true);
            }}
          />
        )}
        <DeleteMessageDialog
          messageId={messageId}
          handleDeleteMessage={handleDeleteMessage}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
