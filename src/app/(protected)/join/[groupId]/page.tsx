import { db } from "@/server/db";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { joinGroup } from "@/actions/groups";

type Props = {
  params: { groupId: string };
};

export async function generateMetadata({ params: { groupId } }: Props) {
  const group = await db.group.findUnique({ where: { id: groupId } });
  if (!group) {
    notFound();
  }
  return {
    title: `Join Group ${group.name}`,
    description: group.description,
  } satisfies Metadata;
}

async function JoinGroupPage({ params: { groupId } }: Props) {
  const group = await db.group.findUnique({ where: { id: groupId } });
  if (!group) {
    notFound();
  }

  const result = await joinGroup(groupId);
  if (result.success) {
    redirect(`/app/${groupId}`);
  }
  return (
    <main className="h-screen-without-navbar flex items-center justify-center">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{result.error}</AlertDescription>
      </Alert>
    </main>
  );
}

export default JoinGroupPage;
