import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateEventClient } from "./CreateEventClient";

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

  return <CreateEventClient />;
}
