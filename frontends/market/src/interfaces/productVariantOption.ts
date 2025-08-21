import type { ProductParameterId } from "./productParameter";

export interface ProductVariantOption {
  type: "color" | "size" | "other";
  name: string;
  paramId: ProductParameterId;
  values: string[];
  selectedValue?: string;
  enableValues?: string[];
}
