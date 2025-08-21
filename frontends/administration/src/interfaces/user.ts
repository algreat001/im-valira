export interface User {
  user_id: number;
  email: string;
  name?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  postalCode?: string;
  deliveryCity?: string;
  deliveryAddress?: string;
  roles?: RoleDto[];
  password?: string;
}

export interface RoleDto {
  role: string;
  description: string;
}
