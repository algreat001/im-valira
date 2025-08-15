export type ProductParameterType = "text" | "select" | "number" | "size" | "color" | "material" | "raiting" | "date";

export type ProductParameterId = string;

export interface ProductParameter {
  product_parameter_id: ProductParameterId;
  name: string;
  description?: string;
  type: ProductParameterType;
  options?: string[];
}
