import { apiFetch } from "@/backend/request.service";
import type { User } from "@/interfaces/user";

export async function listUsers(): Promise<any[]> {
  return apiFetch<any[]>("/admin/users/list", { method: "GET" });
}

export async function createUser(payload: Partial<User>): Promise<any> {
  return apiFetch<any>("/admin/users/create", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateUser(userId: number | string, payload: Partial<User>): Promise<User> {
  return apiFetch<User>(
    `/admin/users/profile`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );
}

export async function deleteUser(userId: number | string): Promise<void> {
  return apiFetch(`/admin/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
}

export async function inviteUser(userId: number | string): Promise<void> {
  return apiFetch(`/admin/users/${encodeURIComponent(userId)}/invite`, { method: "POST" });
}

export async function assignRole(userId: number | string, role: string): Promise<void> {
  return apiFetch(
    `/admin/users/${encodeURIComponent(userId)}/roles`,
    { method: "POST", body: JSON.stringify({ role }) }
  );
}

export async function removeRole(userId: number | string, role: string): Promise<void> {
  return apiFetch(`/admin/users/${encodeURIComponent(userId)}/roles/${encodeURIComponent(role)}`, { method: "DELETE" });
}

export async function resetPassword(userId: number | string): Promise<void> {
  return apiFetch(`/admin/users/${encodeURIComponent(userId)}/password/reset`, { method: "POST" });
}
