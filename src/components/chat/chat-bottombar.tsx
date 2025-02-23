"use client";
import { SendHorizontal } from "lucide-react";
import React, { useRef, useState } from "react";
import { sendMessage as sendMessageAction } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "./emoji-picker";

interface ChatBottombarProps {
  groupId: string;
}

export default function ChatBottombar({ groupId }: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = async () => {
    if (isSending) return;
    setIsSending(true);
    if (message.trim()) {
      await sendMessageAction({
        content: message,
        groupId,
      });

      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    setIsSending(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 p-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="relative w-full"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Aa"
            className="flex h-10 resize-none items-center overflow-hidden rounded-full border bg-background"
          ></Textarea>
          <div className="absolute bottom-0.5 right-2">
            <EmojiPicker
              onChange={(value) => {
                setMessage(message + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9",
            "shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
          )}
          onClick={handleSend}
          disabled={!message.trim() || isSending}
        >
          <SendHorizontal size={20} className="text-muted-foreground" />
        </Button>
      </AnimatePresence>
    </div>
  );
}
