import { db } from "@/server/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <main className="h-screen-without-navbar flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Joining Group {group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {result.error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          ) : (
            <Alert variant="success">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>You have joined the group!</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default JoinGroupPage;