import type { CatalogMeta } from "@/interfaces/meta";

export interface Category {
  category_id?: number;
  name: string;
  parent?: number;
  hasChildren?: boolean;
  meta: CatalogMeta;
}
