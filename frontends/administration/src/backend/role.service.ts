import { apiFetch } from "@/backend/request.service";

import type { Role } from "@/interfaces/role";

export async function listRoles(): Promise<Role[]> {
  return apiFetch<Role[]>("/admin/roles/list", { method: "GET" });
}

export async function createRole(payload: Role): Promise<Role> {
  return apiFetch<Role>("/admin/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRole(roleName: string, payload: Partial<Role>): Promise<Role> {
  return apiFetch<Role>(`/admin/roles/${encodeURIComponent(roleName)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteRole(roleName: string): Promise<void> {
  await apiFetch(`/admin/roles/${encodeURIComponent(roleName)}`, { method: "DELETE" });
}
