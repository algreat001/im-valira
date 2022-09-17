import { JsonMap } from "../../json";

export interface PhotoMeta extends JsonMap {
  name: string;
  link: string;
}

export interface ActionMeta extends JsonMap {
  name: string;
  description: string;
  link?: string;
  image?: string;
  operation: string;
  operand: string;
}

export type OptionType = "color" | "material";

export interface Option extends JsonMap {
  name: string;
  description: string;
  type: OptionType;
  option: string;
  action: ActionMeta;
}

export interface OptionMeta extends JsonMap {
  name: string;
  description: string;
  options: Option[];
}

export interface CatalogMeta extends JsonMap {
  photo?: PhotoMeta[];
  description: string;
}

export interface ProductMeta extends JsonMap {
  description: string;
  price: number;
  actions: ActionMeta[];
  photos: PhotoMeta[];
  options: OptionMeta[];
}
