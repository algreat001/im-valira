export interface CartItem {
  cart_item_id: number;
  product_id: number;
  article?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant_id?: number;
}
