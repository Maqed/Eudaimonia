import { CreateOrEditGroup } from "@/components/groups/create-or-edit-group";

function CreateGroupPage() {
  return (
    <main className="container mx-auto mt-8 max-w-md">
      <h1 className="mb-6 text-3xl font-bold">Create a New Group</h1>
      <CreateOrEditGroup />
    </main>
  );
}

export default CreateGroupPage;
