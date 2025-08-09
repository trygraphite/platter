import { getCurrentStaff } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentStaff();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
