export interface PhotoMeta {
  name: string;
  link: string;
}

export interface ActionMeta {
  name: string;
  description: string;
  link?: string;
  image?: string;
  operation: string;
  operand: string;
}

export interface CatalogMeta {
  photo?: PhotoMeta[];
  description: string;
}

export interface ProductMeta {
  description: string;
  price: number;
  actions: ActionMeta[];
  photos: PhotoMeta[];
}
