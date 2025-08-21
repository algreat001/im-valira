<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";

import { useRoleStore } from "@/stores/role";
import type { User } from "@/interfaces/user";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
  user: User | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "add-role": [ role: string ];
  "remove-role": [ role: string ];
}>();

const roleStore = useRoleStore();
const { roles, loading: rolesLoading } = storeToRefs(roleStore);

const newRole = ref<string>("");

const rolesOptions = computed(() => (roles.value || []).map(r => r.role));

function onClose() {
  open.value = false;
}

function onAdd() {
  if (!newRole.value) {
    return;
  }
  emit("add-role", newRole.value);
  newRole.value = "";
}

async function onRemove(role: string) {
  emit("remove-role", role);
}

watch(open, async (v) => {
  if (v) {
    await roleStore.load();
  } else {
    newRole.value = "";
  }
});
</script>

<template>
  <v-dialog v-model="open" max-width="640">
    <v-card>
      <v-card-title>Роли пользователя</v-card-title>
      <v-card-text>
        <div v-if="props.user" class="mb-3">
          <div class="text-subtitle-2">Email: {{ props.user.email }}</div>
          <div class="text-subtitle-2">Имя: {{ props.user.name }}</div>
        </div>

        <div class="mb-2">Текущие роли:</div>
        <div class="mb-4">
          <v-chip v-for="r in (props.user?.roles || [])"
                  :key="r.role"
                  class="mr-1 mb-1"
                  size="small"
                  color="primary"
                  variant="tonal"
                  closable
                  @click:close="onRemove(r.role)"
          >
            {{ r.role }}
          </v-chip>
        </div>

        <div class="d-flex align-center">
          <v-autocomplete v-model="newRole"
                          :items="rolesOptions"
                          :loading="rolesLoading"
                          label="Роль"
                          density="comfortable"
                          hide-details
                          clearable
                          class="mr-2"
                          style="max-width: 260px"
          />
          <v-btn color="primary"
                 :loading="props.loading"
                 :disabled="!newRole"
                 @click="onAdd"
          >
            Добавить
          </v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onClose">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="sass">
</style>
