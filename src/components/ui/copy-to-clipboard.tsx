"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clipboard, Check } from "lucide-react";

export default function CopyToClipboard({
  href,
  copyMessage = "Copy Link",
  copiedMessage = "Copied",
}: {
  href: string;
  copyMessage?: string;
  copiedMessage?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = () => {
    void navigator.clipboard.writeText(href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            onClick={copyToClipboard}
            className="h-5 w-5 p-0 hover:bg-muted/10"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            <span className="sr-only">copyMessage</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isCopied ? copiedMessage : copyMessage}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
