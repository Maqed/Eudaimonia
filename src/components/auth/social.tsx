"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/consts/routes";
import { useSearchParams } from "next/navigation";

function Social() {
  const searchParams = useSearchParams();
  function handleClick(provider: "google") {
    return signIn(provider, {
      callbackUrl: searchParams.get("callbackUrl") ?? DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className="flex w-full flex-col items-center gap-y-2">
      <Button
        size="lg"
        className="flex w-full gap-x-2"
        variant="outline"
        onClick={() => handleClick("google")}
      >
        Continue With Google
        <Image
          src="/OAuthProviders/Google.webp"
          alt={"Google"}
          width={100}
          height={100}
          className="h-5 w-5"
        />
      </Button>
    </div>
  );
}

export default Social;
