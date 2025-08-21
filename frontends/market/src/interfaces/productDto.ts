import type { ProductMeta } from "@/interfaces/meta";

export interface ProductVariantDto {
  product_variant_id: number;
  name: string;
  meta: Partial<ProductMeta>;
}

export interface ProductDto {
  product_id: number;
  name: string;
  meta: ProductMeta;

  variants?: ProductVariantDto[];
  categories?: number[];
}