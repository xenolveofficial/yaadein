"use client";

import dynamic from "next/dynamic";

const CreateEventWizard = dynamic(
  () => import("@/components/organisms/CreateEventWizard").then((mod) => mod.CreateEventWizard),
  { ssr: false }
);

export function CreateEventClient() {
  return (
    <div className="min-h-screen bg-surface-secondary py-12 px-4">
      <CreateEventWizard />
    </div>
  );
}

// Made with Bob
