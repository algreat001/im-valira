import { JsonMap } from "json";

export type PhotoMeta = string;

export type CurrencyType = "₽" | "$" | "€";

export interface Currency {
  symbol: CurrencyType;
  coefficient: number;
}

export interface RurCurrency extends Currency {
  symbol: "₽";
  coefficient: 1.0;
}

export type Operation = "percentAdd" | "percentSub" | "add" | "sub";

export interface CharacteristicMeta extends JsonMap {
  name: string;
  value: string;
  unitOfMeasurement: string;
  link?: string;
}

export interface OperationMeta extends JsonMap {
  operation: Operation;
  operand: number;
}

export interface ActionMeta extends JsonMap {
  name: string;
  description: string;
  link?: string;
  image?: string;
  operation: OperationMeta;
}

export type OptionType = "color" | "material" | "size";

export interface Option extends JsonMap {
  name: string;
  description?: string;
  value: number | string;
  operation?: OperationMeta;
}

export interface OptionMeta extends JsonMap {
  name?: string;
  description?: string;
  type: OptionType;
  options: Option[];
}

export interface CatalogMeta extends JsonMap {
  photos?: PhotoMeta[];
  description: string;
}

export interface ProductReviewMeta extends JsonMap {
  email: string;
  author: string;
  text: string;
  rating?: number;
  photos?: PhotoMeta[];
  dataUpdate?: Date;
}

export interface ProductMeta extends JsonMap {
  description: string;
  price: number;
  rating: number;

  amount?: number;
  deliveryDate?: Date;

  actions: ActionMeta[];
  photos: PhotoMeta[];
  options: OptionMeta[];
  characteristics?: CharacteristicMeta[];
  reviews?: ProductReviewMeta[];
}

export interface CartMeta extends JsonMap {
  productsCart: ProcuctCartMeta[];
  
}
