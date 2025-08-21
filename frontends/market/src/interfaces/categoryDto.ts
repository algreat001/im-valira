import type { CatalogMeta } from "@/interfaces/meta";

export interface CategoryDto {
  category_id: number;
  name: string;
  parent?: number;
  hasChildren?: boolean;
  meta: CatalogMeta;
}
