"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SmileIcon } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

interface EmojiData {
  native: string;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="h-5 w-5 text-muted-foreground transition hover:text-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Picker
          emojiSize={18}
          theme="dark"
          data={data}
          maxFrequentRows={1}
          onEmojiSelect={(emoji: EmojiData) => onChange(emoji.native)} // Specify EmojiData type
        />
      </PopoverContent>
    </Popover>
  );
};
