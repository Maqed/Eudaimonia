"use client";
import { useTransition } from "react";
import EditAccountSection from "./_components/edit-section";
import DeleteAccountSection from "./_components/delete-section";

function UserSettingsPage() {
  const [isPending, startTransition] = useTransition();
  return (
    <main className="container mt-4 sm:mx-auto md:max-w-4xl">
      <EditAccountSection
        isPending={isPending}
        startTransition={startTransition}
      />
      <DeleteAccountSection
        isPending={isPending}
        startTransition={startTransition}
      />
    </main>
  );
}

export default UserSettingsPage;
