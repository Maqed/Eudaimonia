"use client";
import confetti from "canvas-confetti";

import { cn } from "@/lib/utils";

import { Button, ButtonProps } from "@/components/ui/button"; // Updated import
import { type ReactNode } from "react";

export function ConfettiSideCannons({
  className,
  children,
  durationInSeconds = 0.75,
  handleClick,
  ...props
}: ButtonProps & {
  className?: string;
  durationInSeconds?: number;
  handleClick?: () => void;
  children: ReactNode;
}) {
  const _handleClick = () => {
    const end = Date.now() + durationInSeconds * 1000; // 1 second
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <Button
      className={cn(className)}
      {...props}
      onClick={() => {
        _handleClick();
        handleClick && handleClick();
      }}
    >
      {children}
    </Button>
  );
}
