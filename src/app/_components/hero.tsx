"use client";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import Link from "next/link";
import { MoveDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

function Hero() {
  return (
    <section
      id="hero"
      className="h-screen-without-navbar relative flex w-full flex-col items-center justify-center gap-3"
    >
      <Spotlight
        className="absolute left-1/2 top-0 -translate-x-1/2 transform max-lg:hidden md:-top-20"
        fill="white"
      />
      <TextGenerateEffect
        className="text-center"
        wordClassName="text-primary text-4xl lg:text-6xl"
        words="Cultivate Happiness Through Habits"
      />
      <p className="text-center text-base text-foreground/70 md:text-lg lg:text-xl">
        Eudaimonia empowers you to build lasting habits, track your progress,
        and achieve personal growth.
      </p>
      <div>
        <Link href={DEFAULT_UNAUTHENTICATED_REDIRECT}>
          <Button>Track your habits now</Button>
        </Link>
      </div>
      <div
        onClick={() => {
          scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }}
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 transform cursor-pointer flex-col items-center justify-center gap-3 text-foreground/60"
      >
        <h6>See how it works</h6>
        <span className="inline-block animate-bounce transition-transform duration-1000 ease-in-out">
          <MoveDown />
        </span>
      </div>
    </section>
  );
}

export default Hero;
