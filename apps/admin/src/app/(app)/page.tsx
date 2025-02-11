import { redirect } from "next/navigation";
import PageContent from "./page-content";
import getServerSession from "@/lib/auth/server";

export default async function Page() {
  const session = await getServerSession();
  // Check if the session is valid
  if (!session?.user) {
    return redirect("/login");
  }
  return <PageContent />;
}
