import type { OrderMeta } from "@/interfaces/meta";

export type OrderStatus =
  "pending"
  | "completed"
  | "cancelled"
  | "processing"
  | "shipped"
  | "delivered"
  | "refunded"
  | "failed"
  | "unknown";

export type CreateOrderDto = OrderMeta

export type CreateOrderResponse = {
  orderId?: string | number;
  paymentToken?: string;
  noPayment?: boolean;
};

export interface OrderDto {
  order_id: number,
  number: string,
  status: OrderStatus,
  is_completed: boolean,
  meta: OrderMeta,
  created_at: string,
  updated_at: string,
}

export type UpdateOrderDto = Partial<OrderDto>

export interface OrderItemDto {
  order_item_id: number;
  order_id: number;
  product_id: number;
  article?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant_id?: number;
}