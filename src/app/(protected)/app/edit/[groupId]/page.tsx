import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { CreateOrEditGroup } from "@/components/groups/create-or-edit-group";
import { checkIfLoggedIn } from "@/lib/server-utils";

async function EditGroupPage({ params }: { params: { groupId: string } }) {
  const { session } = await checkIfLoggedIn();

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
    isPrivate: group.isPrivate,
  };

  return (
    <main className="container mx-auto mt-8 max-w-md">
      <h1 className="mb-6 text-3xl font-bold">Edit Group</h1>
      <CreateOrEditGroup groupId={params.groupId} initialData={initialData} />
    </main>
  );
}

export default EditGroupPage;
