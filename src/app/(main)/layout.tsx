import * as React from "react";
import { AppHeader } from "@/components/(custom)/shared/AppHeader";
import { syncUser } from "@/lib/actions";

// This is an invisible server component that ensures the user is synced.
async function UserSync() {
  await syncUser();
  return null; // This component renders nothing.
}

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-screen-xl">
          {children}
        </div>
      </main>
    </div>
  );
}
