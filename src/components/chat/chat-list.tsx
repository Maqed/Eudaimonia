"use client";
import { type Message, type User } from "@prisma/client";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";

export type MessageType = Message & { user: User };
export type selectedUserType =
  | ({
      user: {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
      };
    } & {
      id: string;
      userId: string;
      groupId: string;
      joinedAt: Date;
      habitCompletedAt: Date[];
    })
  | undefined;

interface ChatListProps {
  messages?: MessageType[];
  selectedUser: selectedUserType;
  groupId: string;
}

export function ChatList({ messages, selectedUser, groupId }: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
                  duration: messages.indexOf(message) * 0.05 + 0.2,
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar groupId={groupId} />
    </div>
  );
}
