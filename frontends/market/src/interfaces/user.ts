export interface User {
  id: string | number;
  email: string;
  name?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  postalCode?: string;
  deliveryCity?: string;
  deliveryAddress?: string;
  roles?: string[];

  [key: string]: any;
}
