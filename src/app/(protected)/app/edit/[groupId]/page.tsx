import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { CreateOrEditGroup } from "@/components/groups/create-or-edit-group";
import { redirect } from "next/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { headers } from "next/headers";

async function EditGroupPage({ params }: { params: { groupId: string } }) {
  const headersList = headers();
  // read the custom x-url header
  const header_url = headersList.get("x-pathname");
  const session = await getServerAuthSession();
  if (!session) {
    redirect(`${DEFAULT_UNAUTHENTICATED_REDIRECT}?callbackUrl=${header_url}`);
  }

  const group = await db.group.findUnique({
    where: { id: params.groupId },
    include: { admin: true },
  });

  if (!group || group.adminId !== session.user.id) {
    notFound();
  }

  const initialData = {
    name: group.name,
    description: group.description ?? "",
    isPrivate: group.isPrivate as boolean,
  };

  return (
    <main className="container mx-auto mt-8 max-w-md">
      <h1 className="mb-6 text-3xl font-bold">Edit Group</h1>
      <CreateOrEditGroup groupId={params.groupId} initialData={initialData} />
    </main>
  );
}

export default EditGroupPage;
