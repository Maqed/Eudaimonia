"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButton {
  label: string;
  href: string;
}

function BackButton({ label, href }: BackButton) {
  return (
    <Button variant="link" className="w-full font-normal" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export default BackButton;
