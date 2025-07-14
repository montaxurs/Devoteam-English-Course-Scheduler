import * as React from "react";
import { AppHeader } from "@/components/(custom)/shared/AppHeader";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 bg-muted/40 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-screen-xl">
            {children}
        </div>
      </main>
    </div>
  );
}