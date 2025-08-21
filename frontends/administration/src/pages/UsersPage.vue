<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/stores/user";

import type { User } from "@/interfaces/user";

import UserCreateDialog from "@/components/users/UserCreateDialog.vue";
import UserRolesDialog from "@/components/users/UserRolesDialog.vue";
import UserInviteDialog from "@/components/users/UserInviteDialog.vue";
import UserDeleteDialog from "@/components/users/UserDeleteDialog.vue";
import UserResetPasswordDialog from "@/components/users/UserResetPasswordDialog.vue";
import UserEditDialog from "@/components/users/UserEditDialog.vue";

const userStore = useUserStore();
const { users, loading, error } = storeToRefs(userStore);

const createDialog = ref(false);
const rolesDialog = ref(false);
const inviteDialog = ref(false);
const deleteDialog = ref(false);
const resetDialog = ref(false);
const editDialog = ref(false);

const editingUser = ref<User | null>(null);
const inviteUserRef = ref<User | null>(null);
const deleteUserRef = ref<User | null>(null);
const resetUserRef = ref<User | null>(null);
const editUserRef = ref<User | null>(null);

function openCreateDialog() {
  createDialog.value = true;
}

async function submitCreate(payload: Partial<User>) {
  await userStore.create(payload);
  createDialog.value = false;
}

function openInviteConfirm(u: User) {
  inviteUserRef.value = u;
  inviteDialog.value = true;
}

async function confirmInvite() {
  if (!inviteUserRef.value) {
    return;
  }
  await userStore.invite(inviteUserRef.value);
  inviteDialog.value = false;
}

function openDeleteConfirm(u: User) {
  deleteUserRef.value = u;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (!deleteUserRef.value) {
    return;
  }
  await userStore.remove(deleteUserRef.value);
  deleteDialog.value = false;
}

function openResetConfirm(u: User) {
  resetUserRef.value = u;
  resetDialog.value = true;
}

async function confirmReset() {
  if (!resetUserRef.value) {
    return;
  }
  await userStore.resetPassword(resetUserRef.value);
  resetDialog.value = false;
}

function openEditDialog(u: User) {
  editUserRef.value = u;
  editDialog.value = true;
}

async function confirmEdit(payload: Partial<User>) {
  if (!editUserRef.value) {
    return;
  }
  await userStore.update(editUserRef.value, payload);
  editDialog.value = false;
}

function openRolesDialog(u: User) {
  editingUser.value = u;
  rolesDialog.value = true;
}

async function onAddRole(role: string) {
  if (!editingUser.value) {
    return;
  }
  const user_id = editingUser.value.user_id;
  await userStore.grantRole(editingUser.value, role);
  editingUser.value = useUserStore().users.find(u => u.user_id === user_id) ?? null;
}

async function onRemoveRole(role: string) {
  if (!editingUser.value) {
    return;
  }
  const user_id = editingUser.value.user_id;
  await userStore.revokeRole(editingUser.value, role);
  editingUser.value = useUserStore().users.find(u => u.user_id === user_id) ?? null;
}

watch(inviteDialog, (v) => {
  if (!v) {
    inviteUserRef.value = null;
  }
});
watch(deleteDialog, (v) => {
  if (!v) {
    deleteUserRef.value = null;
  }
});
watch(resetDialog, (v) => {
  if (!v) {
    resetUserRef.value = null;
  }
});
watch(editDialog, (v) => {
  if (!v) {
    editUserRef.value = null;
  }
});
watch(rolesDialog, (v) => {
  if (!v) {
    editingUser.value = null;
  }
});

onMounted(userStore.load);
</script>

<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Пользователи</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" :loading="loading" @click="openCreateDialog">Добавить пользователя</v-btn>
    </v-toolbar>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-3">{{ error }}</v-alert>

    <v-data-table
      :items="users"
      :headers="[
        { title: 'ID', key: 'user_id' },
        { title: 'Email', key: 'email' },
        { title: 'Имя', key: 'name', value: item => `${[item.lastName, item.firstName, item.middleName].filter(Boolean).join(' ')}` },
        { title: 'Роли', key: 'roles', align: 'center' },
        { title: 'Действия', key: 'actions', sortable: false, align: 'center' }
      ]"
      :loading="loading"
    >
      <template #item.roles="{ item }">
        <v-chip v-for="r in (item.roles || [])"
                :key="r.role"
                class="mr-1"
                size="small"
                color="primary"
                variant="tonal"
        >
          {{ r.role }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn :icon="'mdi-pencil-outline'" size="small" variant="text" @click="openEditDialog(item)" />
        <v-btn :icon="'mdi-email-outline'" size="small" variant="text" @click="openInviteConfirm(item)" />
        <v-btn :icon="'mdi-lock-reset'" size="small" variant="text" @click="openResetConfirm(item)" />
        <v-btn :icon="'mdi-shield-account-outline'" size="small" variant="text" @click="openRolesDialog(item)" />
        <v-btn :icon="'mdi-delete-outline'"
               size="small"
               variant="text"
               color="error"
               @click="openDeleteConfirm(item)"
        />
      </template>
    </v-data-table>

    <user-create-dialog
      v-model="createDialog"
      :loading="loading"
      @submit="submitCreate"
    />

    <user-roles-dialog
      v-model="rolesDialog"
      :loading="loading"
      :user="editingUser"
      @add-role="onAddRole"
      @remove-role="onRemoveRole"
    />

    <user-invite-dialog
      v-model="inviteDialog"
      :loading="loading"
      :user="inviteUserRef"
      @confirm="confirmInvite"
    />

    <user-delete-dialog
      v-model="deleteDialog"
      :loading="loading"
      :user="deleteUserRef"
      @confirm="confirmDelete"
    />

    <user-reset-password-dialog
      v-model="resetDialog"
      :loading="loading"
      :user="resetUserRef"
      @confirm="confirmReset"
    />

    <user-edit-dialog
      v-model="editDialog"
      :loading="loading"
      :user="editUserRef"
      @submit="confirmEdit"
    />
  </v-container>
</template>

<style lang="sass">
</style>
