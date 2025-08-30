import { CategoryMeta, OrderMeta, ProductMeta } from '@/model/meta';
import { OrderStatus } from '@/model/order.entity';

export interface UserDto {
  user_id?: number;
  email?: string;
  name?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  postalCode?: string;
  deliveryCity?: string;
  deliveryAddress?: string;

  password?: string;
  isActive?: boolean;
  roles?: RoleDto[];
  token?: string;
}

export interface CategoryDto {
  category_id?: number;
  name: string;
  meta: CategoryMeta;
  products?: ProductDto[];
  parent?: number;
  hasChildren?: boolean;
}

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

export interface RoleDto {
  role: string;
  description: string;
}

export interface AddRoleDto {
  email: string;
  role: string;
}

export type DeleteRoleDto = AddRoleDto

export interface OrderRequestDto {
  products: ProductDto[];
  user: UserDto;
}

export interface OrderResponseDto {
  products: ProductDto[];
  user: UserDto;
}


export interface CartItemDto {
  cart_item_id: number;
  product_id: number;
  article?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant_id?: number;
}

export type AddCartItemDto = {
  product_id: number;
  variant_id?: number | null;
  quantity: number;
};

export type UpdateCartItemDto = {
  quantity: number;
};

export type CreateOrderDto = OrderMeta

export interface NewOrderDto {
  email: string;
}

export interface OrderDto {
  order_id: number,
  number: string,
  status: OrderStatus,
  is_completed: boolean,
  is_paid: boolean,
  meta: OrderMeta,
  created_at: string,
  updated_at: string,
  items?: OrderItemDto[],
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

export type CreateOrderResponse = {
  orderId?: string | number;
  paymentToken?: string;
  noPayment?: boolean;
};

export interface DashboardMetricsDto {
  pendingOrdersCount: number;
  unpaidOrdersCount: number;
  unshippedOrdersCount: number;

  cancelledOrdersThisMonth: number;
  cancelledOrdersPrevMonth: number;

  paymentsThisMonth: number;
  paymentsPrevMonth: number;

  productsCount: number;
  categoriesCount: number;

  usersCount: number;
  newUsersThisMonth: number;

  refundedOrdersThisMonth: number;
  ordersThisMonth: number;

  lowStockProductsCount: number;
}

export interface BannerItemDto {
  id: number;
  image: string;
  title?: string;
  message?: string;
  alt?: string;
  link?: string;
}


