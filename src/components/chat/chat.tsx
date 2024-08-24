"use client";
import { ChatList, selectedUserType } from "./chat-list";
import React, { useEffect, useRef } from "react";
import { MessageType } from "./chat-list";
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
  const pusherRef = useRef<any>(null);

  useEffect(() => {
    pusherClient.subscribe(groupId);

    pusherRef.current = pusherClient.bind(
      "incoming-message",
      (newMessage: MessageType) => {
        setMessages((prevMessages) => {
          if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });
      },
    );

    return () => {
      pusherClient.unsubscribe(groupId);
      if (pusherRef.current) {
        pusherClient.unbind("incoming-message", pusherRef.current);
      }
    };
  }, [groupId]);

  const sendMessage = (newMessage: MessageType) => {
    // Don't add the message here, let Pusher handle it
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <ChatList
        groupId={groupId}
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
      />
    </div>
  );
}
