"use server";

import { auth } from "@/lib/auth/server";
import { getUserRole, roles } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export type CreateUserState = { error?: string; success?: string } | null;

export async function createUser(_previous: CreateUserState, formData: FormData): Promise<CreateUserState> {
  const { data: session } = await auth.getSession();
  if (!session?.user || getUserRole(session.user as { role?: unknown; appRole?: unknown }) !== "admin") {
    return { error: "Administrator access is required." };
  }

  const role = String(formData.get("role"));
  if (!roles.includes(role as (typeof roles)[number])) return { error: "Choose a valid role." };

  const { error } = await auth.admin.createUser({
    name: String(formData.get("name")).trim(),
    email: String(formData.get("email")).trim().toLowerCase(),
    password: String(formData.get("password")),
    role: role === "admin" ? "admin" : "user",
    data: { appRole: role },
  });

  if (error) return { error: error.message || "Could not create the user." };
  revalidatePath("/users");
  return { success: "User created and ready to sign in." };
}
