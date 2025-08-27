<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";

import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  listVariants,
  createVariant,
  updateVariant,
  deleteVariant
} from "@/backend/product.service";
import type { ProductDto, ProductVariantDto } from "@/interfaces/product";

import ProductCreateDialog from "@/components/products/ProductCreateDialog.vue";
import ProductEditDialog from "@/components/products/ProductEditDialog.vue";
import VariantCreateDialog from "@/components/products/VariantCreateDialog.vue";
import VariantEditDialog from "@/components/products/VariantEditDialog.vue";
import { formatCurrency } from "@/helpers/format.ts";

const loading = ref(false);
const error = ref<string | null>(null);
const products = ref<ProductDto[]>([]);
const selectedProductId = ref<number | null>(null);
const selectedProduct = ref<number[] | null>(null);
const variants = ref<ProductVariantDto[]>([]);

const productCreateDialog = ref(false);
const productEditDialog = ref(false);
const variantCreateDialog = ref(false);
const variantEditDialog = ref(false);

const editProductRef = ref<ProductDto | null>(null);
const editVariantRef = ref<ProductVariantDto | null>(null);

async function loadProducts() {
  loading.value = true;
  error.value = null;
  try {
    products.value = await listProducts();
  } catch (e: any) {
    error.value = e?.message || "Не удалось загрузить товары";
  } finally {
    loading.value = false;
  }
}

async function onSelectProduct(id: number) {
  selectedProductId.value = id;
  variants.value = products.value.find(p => p.product_id === id)?.variants
    ?? await listVariants(id).catch(() => [])
    ?? [];
}

function openProductCreateDialog() {
  productCreateDialog.value = true;
}

async function submitCreateProduct(payload: Partial<ProductDto>) {
  await createProduct(payload);
  productCreateDialog.value = false;
  await loadProducts();
}

function openProductEditDialog(p: ProductDto) {
  editProductRef.value = p;
  productEditDialog.value = true;
}

async function confirmEditProduct(payload: Partial<ProductDto>) {
  if (!editProductRef.value || !editProductRef.value.product_id) {
    return;
  }
  await updateProduct(editProductRef.value.product_id, payload);
  productEditDialog.value = false;
  await loadProducts();
}

async function onDeleteProduct(p: ProductDto) {
  if (!p.product_id) {
    return;
  }
  await deleteProduct(p.product_id);
  if (selectedProductId.value === p.product_id) {
    selectedProductId.value = null;
    variants.value = [];
  }
  await loadProducts();
}

function openVariantCreateDialog() {
  variantCreateDialog.value = true;
}

async function submitCreateVariant(payload: Partial<ProductVariantDto>) {
  if (!selectedProductId.value) {
    return;
  }
  await createVariant(selectedProductId.value, payload);
  variantCreateDialog.value = false;
  await loadProducts();
  await onSelectProduct(selectedProductId.value);
}

function openVariantEditDialog(v: ProductVariantDto) {
  editVariantRef.value = v;
  variantEditDialog.value = true;
}

async function confirmEditVariant(payload: Partial<ProductVariantDto>) {
  if (!selectedProductId.value || !editVariantRef.value) {
    return;
  }
  await updateVariant(selectedProductId.value, editVariantRef.value.product_variant_id, payload);
  variantEditDialog.value = false;
  await loadProducts();
  await onSelectProduct(selectedProductId.value);
}

async function onDeleteVariant(v: ProductVariantDto) {
  if (!selectedProductId.value) {
    return;
  }
  await deleteVariant(selectedProductId.value, v.product_variant_id);
  await loadProducts();
  await onSelectProduct(selectedProductId.value);
}

watch(productEditDialog, (v) => {
  if (!v) {
    editProductRef.value = null;
  }
});
watch(variantEditDialog, (v) => {
  if (!v) {
    editVariantRef.value = null;
  }
});

watch(selectedProduct, async (v: number[] | null) => {
  if (!v || !v[0]) {
    selectedProductId.value = null;
    variants.value = [];
    return;
  }
  await onSelectProduct(v[0] ?? 0);
});

onMounted(loadProducts);
</script>

<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Товары</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" :loading="loading" @click="openProductCreateDialog">Добавить товар</v-btn>
    </v-toolbar>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-3">{{ error }}</v-alert>

    <v-row>
      <v-col cols="12" md="12">
        <v-data-table
          hover
          item-value="product_id"
          :items="products"
          :headers="[
            { title: 'ID', key: 'product_id' },
            { title: 'Фото', key: 'thumb', sortable: false },
            { title: 'Название', key: 'name' },
            { title: 'Цена', key: 'price' },
            { title: 'Действия', key: 'actions', sortable: false }
          ]"
          :loading="loading"
          select-strategy="single"
          show-select
          v-model="selectedProduct"
        >
          <template #item.thumb="{ item }">
            <v-avatar size="40" rounded="lg">
              <smart-image
                v-if="item.meta?.image || (item.meta?.gallery && item.meta.gallery[0])"
                :src="item.meta?.image || item.meta?.gallery?.[0]"
                :alt="item.meta?.image || item.meta?.gallery?.[0]"
                :width="40"
                :height="40"
              />
              <v-icon v-else icon="mdi-image-off" />
            </v-avatar>
          </template>
          <template #item.name="{ item }">
            {{ item.name }}
          </template>
          <template #item.price="{ item }">
            {{ formatCurrency(item.meta?.price) }}
          </template>
          <template #item.actions="{ item }">
            <v-btn :icon="'mdi-pencil-outline'" size="small" variant="text" @click.stop="openProductEditDialog(item)" />
            <v-btn :icon="'mdi-delete-outline'"
                   size="small"
                   variant="text"
                   color="error"
                   @click.stop="onDeleteProduct(item)"
            />
          </template>
        </v-data-table>
      </v-col>

      <v-col cols="12" md="12" v-if="selectedProductId">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>
              Варианты — {{ (products.find(p => p.product_id === selectedProductId)?.name) || "" }}
              (ID: {{ selectedProductId }})
            </v-toolbar-title>
            <v-spacer />
            <v-btn color="primary" :disabled="!selectedProductId" @click="openVariantCreateDialog">
              Добавить вариант
            </v-btn>
          </v-toolbar>

          <v-card-text v-if="!selectedProductId" class="text-medium-emphasis">
            Выберите товар, чтобы управлять вариантами
          </v-card-text>

          <v-data-table
            v-else
            hover
            :items="variants"
            item-key="variant_id"
            :headers="[
              { title: 'ID', key: 'variant_id' },
              { title: 'Фото', key: 'thumb', sortable: false },
              { title: 'Название', key: 'name' },
              { title: 'Цена', key: 'price' },
              { title: 'Действия', key: 'actions', sortable: false }
            ]"
          >
            <template #item.thumb="{ item }">
              <v-avatar size="40" rounded="lg">
                <v-img
                  v-if="item.meta?.image || (item.meta?.gallery && item.meta.gallery[0])"
                  :src="item.meta?.image || item.meta?.gallery?.[0]"
                  cover
                />
                <v-icon v-else icon="mdi-image-off" />
              </v-avatar>
            </template>
            <template #item.name="{ item }">
              {{ item.name }}
            </template>
            <template #item.price="{ item }">
              {{ formatCurrency(item.meta?.price) }}
            </template>
            <template #item.actions="{ item }">
              <v-btn :icon="'mdi-pencil-outline'"
                     size="small"
                     variant="text"
                     @click.stop="openVariantEditDialog(item)"
              />
              <v-btn :icon="'mdi-delete-outline'"
                     size="small"
                     variant="text"
                     color="error"
                     @click.stop="onDeleteVariant(item)"
              />
            </template>
          </v-data-table>

        </v-card>
      </v-col>
    </v-row>

    <product-create-dialog
      v-model="productCreateDialog"
      :loading="loading"
      @submit="submitCreateProduct"
    />
    <product-edit-dialog
      v-model="productEditDialog"
      :loading="loading"
      :product="editProductRef"
      @submit="confirmEditProduct"
    />

    <variant-create-dialog
      v-model="variantCreateDialog"
      :loading="loading"
      @submit="submitCreateVariant"
    />
    <variant-edit-dialog
      v-model="variantEditDialog"
      :loading="loading"
      :variant="editVariantRef"
      :product-id="selectedProductId"
      @submit="confirmEditVariant"
    />
  </v-container>
</template>

<style lang="sass">
.selected-row
  background-color: rgba(var(--v-theme-primary), .08)
</style>
