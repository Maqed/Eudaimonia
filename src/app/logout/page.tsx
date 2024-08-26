"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";

function LogoutPage() {
  useEffect(() => {
    signOut({
      redirect: true,
      callbackUrl: DEFAULT_UNAUTHENTICATED_REDIRECT,
    });
  }, []);
  return <main className="container">Logging out...</main>;
}

export default LogoutPage;
