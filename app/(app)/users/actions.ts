"use server";

import { auth } from "@/lib/auth/server";
import { getUserRole, roles } from "@/lib/permissions";
import { employees } from "@/lib/domain-data";
import { revalidatePath } from "next/cache";

export type CreateUserState = { error?: string; success?: string } | null;

export async function createUser(_previous: CreateUserState, formData: FormData): Promise<CreateUserState> {
  const { data: session } = await auth.getSession();
  if (!session?.user || getUserRole(session.user as { role?: unknown; appRole?: unknown }) !== "admin") {
    return { error: "Administrator access is required." };
  }

  const role = String(formData.get("role"));
  if (!roles.includes(role as (typeof roles)[number])) return { error: "Choose a valid role." };
  const employeeId = String(formData.get("employeeId"));
  const employee = employees.find((item) => item.id === employeeId);
  if (!employee) return { error: "An existing employee must be assigned to this account." };

  const { error } = await auth.admin.createUser({
    name: employee.name,
    email: employee.email,
    password: String(formData.get("password")),
    role: role === "admin" ? "admin" : "user",
    data: { appRole: role, employeeId: employee.id },
  });

  if (error) return { error: error.message || "Could not create the user." };
  revalidatePath("/users");
  return { success: `Account created and assigned to ${employee.name}.` };
}
