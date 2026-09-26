export const roles = ["user", "data_entry", "admin"] as const;

export type AppRole = (typeof roles)[number];

export function getRole(role: unknown): AppRole {
  if (role === "admin" || role === "data_entry") return role;
  return "user";
}

export function getUserRole(user: { role?: unknown; appRole?: unknown }): AppRole {
  return getRole(user.appRole ?? user.role);
}

export function canSubmitForOthers(role: AppRole): boolean {
  return role === "admin" || role === "data_entry";
}

export function canManageUsers(role: AppRole): boolean {
  return role === "admin";
}

export const roleLabels: Record<AppRole, string> = {
  user: "Field user",
  data_entry: "Data entry",
  admin: "Administrator",
};
