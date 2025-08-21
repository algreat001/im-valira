import { ref } from "vue";
import { defineStore } from "pinia";

import { listRoles, createRole, updateRole, deleteRole } from "@/backend/role.service";

import type { Role } from "@/interfaces/role";

export const useRoleStore = defineStore("role", () => {
  const roles = ref<Role[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function load(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      roles.value = await listRoles();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось загрузить роли";
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: Role): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await createRole(payload);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось создать роль";
    } finally {
      loading.value = false;
    }
  }

  async function update(name: string, payload: Partial<Role>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await updateRole(name, payload);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось обновить роль";
    } finally {
      loading.value = false;
    }
  }

  async function remove(name: string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await deleteRole(name);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось удалить роль";
    } finally {
      loading.value = false;
    }
  }

  return {
    roles,
    loading,
    error,
    load,
    create,
    update,
    remove,
  };
});
