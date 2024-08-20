import YourGroups from "./_components/your-groups";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";

async function AppPage() {
  const headersList = headers();
  // read the custom x-url header
  const header_url = headersList.get("x-pathname");
  const session = await getServerAuthSession();
  if (!session) {
    redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
  }

  const userGroups = await db.group.findMany({
    where: {
      OR: [
        { participants: { some: { userId: session.user.id } } },
        { adminId: session.user.id },
      ],
    },
    include: {
      participants: {
        include: { user: true },
        where: { userId: session.user.id },
      },
      admin: true,
    },
  });

  return (
    <main className="container pt-10">
      <YourGroups groups={userGroups} />
    </main>
  );
}

export default AppPage;