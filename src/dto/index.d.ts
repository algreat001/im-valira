import { CatalogMeta, ProductMeta } from "../model/meta";

export interface UserDto {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string;
  photo?: string;
  roles?: RoleDto[];
  token?: string;
}

export interface CatalogDto {
  id: string;
  name: string;
  description: string;
  meta: CatalogMeta;
  products: ProductDto[];
  parent: string;
  hasChildren: boolean;
}

export interface ProductDto {
  id: string;
  name: string;
  meta: ProductMeta;
  catalogs?: CatalogDto[];
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


export interface CreateCartDto {
  id: string;
}

export interface UpdateCartDto {
  id: string;
} //= PartialType(CreateCartDto)


