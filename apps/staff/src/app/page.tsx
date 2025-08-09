import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/utils/auth";

export default async function Home() {
  const user = await getCurrentStaff();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
