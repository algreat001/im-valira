import { apiFetch } from "@/backend/request.service";
import type { Tag } from "@/interfaces/tag";

export async function listTags(): Promise<Tag[]> {
  return apiFetch<Tag[]>("/admin/tags/list", { method: "GET" });
}

export async function createTag(payload: Partial<Tag>): Promise<Tag> {
  return apiFetch<Tag>("/admin/tags", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateTag(tagId: number | string, payload: Partial<Tag>): Promise<Tag> {
  return apiFetch<Tag>(`/admin/tags/${encodeURIComponent(tagId)}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function deleteTag(tagId: number | string): Promise<void> {
  await apiFetch(`/admin/tags/${encodeURIComponent(tagId)}`, { method: "DELETE" });
}

