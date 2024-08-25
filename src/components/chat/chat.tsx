"use client";
import { ChatList, type selectedUserType } from "./chat-list";
import React, { useEffect } from "react";
import { type MessageType } from "./chat-list";
import { pusherClient } from "@/pusher/client";

interface ChatProps {
  messages?: MessageType[];
  selectedUser: selectedUserType;
  groupId: string;
}

export function Chat({ messages, selectedUser, groupId }: ChatProps) {
  const [messagesState, setMessages] = React.useState<MessageType[]>(
    messages ?? [],
  );

  useEffect(() => {
    pusherClient.subscribe(groupId);

    pusherClient.bind("incoming-message", (newMessage: MessageType) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });

    pusherClient.bind(
      "message-deleted",
      ({ messageId }: { messageId: string }) => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== messageId),
        );
      },
    );

    return () => {
      pusherClient.unsubscribe(groupId);
    };
  }, [groupId]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <ChatList
        groupId={groupId}
        messages={messagesState}
        selectedUser={selectedUser}
      />
    </div>
  );
}
