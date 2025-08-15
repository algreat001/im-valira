import { JsonMap } from 'json';

export type CurrencyType = '₽' | '$' | '€';

export interface Currency {
  symbol: CurrencyType;
  coefficient: number;
}

export interface RurCurrency extends Currency {
  symbol: '₽';
  coefficient: 1.0;
}

export type Operation = 'percentAdd' | 'percentSub' | 'add' | 'sub';

export interface SpecMeta extends JsonMap {
  [key: string]: string;
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

export interface CategoryMeta extends JsonMap {
  description: string;
  images?: string;
  icon?: string;
  params?: string[];
}

export interface ProductReviewMeta extends JsonMap {
  email: string;
  author: string;
  text: string;
  rating?: number;
  gallery: string[];
  dataUpdate?: Date;
}

export interface ProductMeta extends JsonMap {
  article: string;
  price: number;
  image: string;
  gallery: string[];
  description: string;

  rating?: number;

  actions?: ActionMeta[];
  specs?: SpecMeta;
  reviews?: ProductReviewMeta[];
}

export interface DeliveryMeta extends JsonMap {
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  name: string;
  tracking_number?: string;
  tracking_link?: string;
}

export interface OrderMeta extends JsonMap {
  payment_method: string;
  description: string;
  total_price: number;
  payment_token?: string;
  delivery?: DeliveryMeta;
}