import type { ProductMeta } from "@/interfaces/meta";

export interface ProductVariantDto {
  product_variant_id: number;
  name: string;
  meta: Partial<ProductMeta>;
}

export interface ProductDto {
  product_id?: number;
  name: string;
  meta: ProductMeta;

  variants?: ProductVariantDto[];
  categories?: number[];
  tags?: string[];
}

export type ProductParameterType = "text" | "select" | "number" | "size" | "color" | "material" | "raiting" | "date";

export interface ProductParameter {
  product_parameter_id: string;
  name: string;
  description?: string;
  type: ProductParameterType;
  options?: string[];
}


export interface ProductVariantOption {
  type: "color" | "size" | "other";
  name: string;
  paramId: string;
  values: string[];
  selectedValue?: string;
  enableValues?: string[];
}
