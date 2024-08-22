import React from "react";
import { Button } from "@/components/ui/button";
import { FrownIcon, Home } from "lucide-react";
import Link from "next/link";

async function GroupNotFound() {
    return (
        <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <FrownIcon className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Oops! Group hasn&apos;t been found
                </h1>
                <p className="mt-4 text-muted-foreground">
                    Maybe the group has been deleted
                </p>
                <div className="mt-6">
                    <Button asChild>
                        <Link href="/app">
                            Home <Home className="ms-1 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default GroupNotFound;
