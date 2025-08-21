<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";

type PaymentMethod = string;

type PaymentOption = {
  value: PaymentMethod;
  label: string;
  icon?: string;
  subtitle?: string;
  disabled?: boolean;
};

const modelValue = defineModel({
  type: String as PropType<PaymentMethod>,
  required: true
});

const props = defineProps<{
  methods?: PaymentOption[];
}>();

const methods = computed<PaymentOption[]>(() =>
  props.methods && props.methods.length
    ? props.methods
    : [
      { value: "sbp", label: "СБП (Система быстрых платежей)", icon: "mdi-qrcode-scan" },
      { value: "bank", label: "Банковский перевод", icon: "mdi-bank-transfer", disabled: true }
    ]
);
</script>

<template>
  <v-card>
    <v-card-title>Способ оплаты</v-card-title>
    <v-divider />
    <v-card-text>
      <v-radio-group v-model="modelValue" class="mt-2">
        <v-radio
          v-for="opt in methods"
          :key="opt.value"
          :value="opt.value"
          :disabled="opt.disabled"
        >
          <template #label>
            <div class="d-flex align-center">
              <v-icon v-if="opt.icon" :icon="opt.icon" class="mr-2" />
              <div class="d-flex flex-column">
                <span>{{ opt.label }}</span>
                <small v-if="opt.subtitle" class="text-medium-emphasis">{{ opt.subtitle }}</small>
              </div>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>
