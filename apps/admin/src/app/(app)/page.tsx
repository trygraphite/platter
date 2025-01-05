import { redirect } from "next/navigation";
import PageContent from "./page-content";
import getServerSession from "@/lib/auth/server";

export default async function Page() {
  const session = await getServerSession();
  if (session === null) return redirect("/login");

  return <PageContent />;
}
