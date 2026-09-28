"use server";

import { auth } from "@/lib/auth/server";
import { getUserRole, roles } from "@/lib/permissions";
import { getEmployeeById } from "@/lib/db/queries";
import { db } from "@/lib/db/client";
import { employees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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
  const employee = await getEmployeeById(employeeId);
  if (!employee) return { error: "An existing employee must be assigned to this account." };
  if (employee.authUserId) return { error: "This employee already has an account." };

  const { data, error } = await auth.admin.createUser({
    name: employee.name,
    email: employee.email,
    password: String(formData.get("password")),
    role: role === "admin" ? "admin" : "user",
    data: { appRole: role, employeeId: employee.id },
  });

  if (error) return { error: error.message || "Could not create the user." };
  const authUserId = (data as { id?: string; user?: { id?: string } } | null)?.user?.id || (data as { id?: string } | null)?.id;
  if (authUserId) await db.update(employees).set({ authUserId, role: role as "user" | "data_entry" | "admin", updatedAt: new Date() }).where(eq(employees.id, employee.id));
  revalidatePath("/users");
  return { success: `Account created and assigned to ${employee.name}.` };
}
