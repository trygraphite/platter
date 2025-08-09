"use server";

import { redirect } from "next/navigation";
import { getCurrentStaff, staffLogin, staffLogout } from "@/utils/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const result = await staffLogin(email, password);

  if (result.success) {
    redirect("/dashboard");
  }

  return result;
}

export async function logoutAction() {
  await staffLogout();
  redirect("/login");
}

export async function getCurrentStaffAction() {
  return await getCurrentStaff();
}
