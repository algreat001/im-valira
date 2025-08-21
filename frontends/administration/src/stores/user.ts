import { ref } from "vue";
import { defineStore } from "pinia";

import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  inviteUser,
  assignRole,
  removeRole,
  resetPassword as resetUserPassword
} from "@/backend/users.service";

import type { User } from "@/interfaces/user";

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function load(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      users.value = (await listUsers()) as User[];
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось загрузить пользователей";
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: Partial<User>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await createUser(payload);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось создать пользователя";
    } finally {
      loading.value = false;
    }
  }

  async function update(u: User, payload: Partial<User>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await updateUser(u.user_id, payload);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось обновить пользователя";
    } finally {
      loading.value = false;
    }
  }

  async function remove(u: User): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await deleteUser(u.user_id);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось удалить пользователя";
    } finally {
      loading.value = false;
    }
  }

  async function invite(u: User): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await inviteUser(u.user_id);
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось отправить приглашение";
    } finally {
      loading.value = false;
    }
  }

  async function grantRole(u: User, role: string): Promise<void> {
    if (!role) {
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      await assignRole(u.user_id, role);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось назначить роль";
    } finally {
      loading.value = false;
    }
  }

  async function revokeRole(u: User, role: string): Promise<void> {
    if (!role) {
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      await removeRole(u.user_id, role);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось убрать роль";
    } finally {
      loading.value = false;
    }
  }

  async function resetPassword(u: User): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await resetUserPassword(u.user_id);
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось сбросить пароль";
    } finally {
      loading.value = false;
    }
  }

  return {
    users,
    loading,
    error,
    load,
    create,
    update,
    remove,
    invite,
    grantRole,
    revokeRole,
    resetPassword
  };
});
