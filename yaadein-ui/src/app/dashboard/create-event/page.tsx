import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import dynamic from "next/dynamic";

const CreateEventWizard = dynamic(() => import("@/components/organisms/CreateEventWizard").then((mod) => mod.CreateEventWizard), {
  ssr: false,
});

export const metadata = {
  title: "Create Event | YAADEIN",
  description: "Create a new event and share the gallery with guests.",
};

export default async function CreateEventPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-surface-secondary py-12 px-4">
      <CreateEventWizard />
    </div>
  );
}
