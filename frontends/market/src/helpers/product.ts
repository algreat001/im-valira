import type { ProductDto as IProduct, ProductVariantDto } from "@/interfaces/productDto.ts";
import type { ProductVariantOption } from "@/interfaces/productVariantOption";
import { PRODUCT_VARIANT_COLORS, PRODUCT_VARIANT_SIZES } from "@/constants";
import type { SpecMeta } from "@/interfaces/meta";

export class Product {
  product_id: number;
  name: string;
  article?: string;
  price?: number;
  categories: number[];
  image: string;
  gallery: string[];
  description: string;
  specs: SpecMeta;
  variants?: ProductVariantDto[];

  private selectedVariantId: undefined | number = undefined;

  constructor(data: IProduct) {
    this.product_id = data.product_id;
    this.name = data.name;
    this.article = data.meta.article;
    this.price = data.meta.price;
    this.categories = data.categories ?? [];
    this.image = data.meta.image;
    this.gallery = data.meta.gallery;
    this.description = data.meta.description;
    this.specs = data.meta.specs ?? {};
    this.variants = data.variants;

    if (this.hasVariants) {
      this.selectedVariantId = this.variants![0].product_variant_id;
    }

  }

  setSelectedVariant(variant: undefined | ProductVariantDto): Product {
    this.selectedVariantId = variant?.product_variant_id;
    return this;
  }

  get selectedVariant(): undefined | ProductVariantDto {
    if (!this.selectedVariantId || !this.hasVariants) {
      return undefined;
    }
    return this.variants!.find(v => v.product_variant_id === this.selectedVariantId);
  }

  get currentPrice(): number {
    // Проверяем, есть ли выбранный вариант товара
    if (this.selectedVariant?.meta.price !== undefined) {
      return this.selectedVariant.meta.price ?? this.price ?? 0;
    }

    if (!this.hasVariants) {
      return this.price ?? 0;
    }

    const minPrice = this.variants?.reduce((min, current) => {
      if (!current.meta.price) {
        return min;
      }
      return min < current.meta.price ? min : current.meta.price;
    }, (this.price ?? 0));

    return minPrice ?? 0;
  }

  formatPrice(currency: string = "₽"): string {
    return `${this.currentPrice.toLocaleString("ru-RU")} ${currency}`;
  }

  get hasVariants(): boolean {
    return !!this.variants && Array.isArray(this.variants) && this.variants.length > 0;
  }

  get displayName(): string {
    return this.selectedVariant?.name || this.name;
  }

  get displayArticle(): string {
    return this.selectedVariant?.meta.article || this.article || "";
  }

  get displayImage(): string {
    return this.selectedVariant?.meta.image || this.image || "";
  }

  get displayGallery(): string[] {
    if (this.selectedVariant?.meta.gallery && this.selectedVariant?.meta.gallery.length > 0) {
      return this.selectedVariant.meta.gallery;
    }
    return this.gallery || [];
  }

  get displaySpecs(): SpecMeta {
    return { ...(this.specs || {}), ...(this.selectedVariant?.meta.specs || {}) };
  }

  findVariantById(variantId: number) {
    if (!this.variants) {
      return null;
    }
    return this.variants.find(v => v.product_variant_id === variantId) || null;
  }

  getVariantOptions(): ProductVariantOption[] {
    if (!this.hasVariants) {
      return [];
    }

    const options: ProductVariantOption[] = [];
    const variantSpecs = new Map<string, Set<string>>();

    this.variants!.forEach(variant => {
      if (variant.meta.specs) {
        Object.entries(variant.meta.specs).forEach(([ key, value ]) => {
          if (!variantSpecs.has(key)) {
            variantSpecs.set(key, new Set());
          }
          variantSpecs.get(key)?.add(value as string);
        });
      }
    });

    variantSpecs.forEach((values, paramId) => {
      const valuesArray = Array.from(values);
      let type: "color" | "size" | "other" = "other";
      let name = paramId;

      if (paramId === "color") {
        type = "color";
        name = "Цвет";
      } else if (paramId === "size") {
        type = "size";
        name = "Размер";
      } else {
        const isColor = valuesArray.every(value => Object.keys(PRODUCT_VARIANT_COLORS).includes(value));
        const isSize = valuesArray.every(value => PRODUCT_VARIANT_SIZES.includes(value));

        if (isColor) {
          type = "color";
          name = "Цвет";
        } else if (isSize) {
          type = "size";
          name = "Размер";
        }
      }

      options.push({
        type,
        name,
        paramId,
        enableValues: [],
        values: valuesArray
      });
    });

    return options;
  }


  calcAvailableVariants(selectedOptions?: ProductVariantOption[]): ProductVariantDto[] {
    if (!this.hasVariants || !selectedOptions?.length) {
      return this.variants || [];
    }

    return this.variants!.filter(variant => {
      if (!variant.meta.specs) {
        return false;
      }

      return selectedOptions.every(option => {
        if (!option.selectedValue) {
          return true;
        }
        if (!variant.meta.specs) {
          return true;
        }

        return variant.meta.specs[option.paramId] === option.selectedValue;
      });
    });
  }


  calcAvailableVariantsForCurrentVariant(): ProductVariantDto[] {
    if (!this.hasVariants || !this.selectedVariant) {
      return this.variants || [];
    }

    const currentVariant = this.selectedVariant;
    if (!currentVariant.meta.specs) {
      return this.variants || [];
    }

    return this.variants!.filter(variant => {
      if (!variant.meta.specs) {
        return false;
      }

      if (!variant.meta.specs || !currentVariant.meta.specs) {
        return false;
      }

      // Check if both variants have same number of specs
      if (Object.keys(variant.meta.specs).length !== Object.keys(currentVariant.meta.specs).length) {
        return false;
      }

      let differences = 0;
      for (const [ key, value ] of Object.entries(currentVariant.meta.specs)) {
        if (variant.meta.specs[key] !== value) {
          differences++;
        }
      }

      return differences === 1;
    });
  }


  findMatchingVariant(variantOptions: ProductVariantOption[]): ProductVariantDto | undefined {
    if (!this.hasVariants) {
      return undefined;
    }
    return this.variants!.find(variant => {
      if (!variant.meta.specs) {
        return false;
      }

      // Проверяем, что вариант соответствует всем выбранным опциям
      return variantOptions.every(option => {
        if (!option.selectedValue) {
          return true;
        }
        return variant.meta.specs?.[option.paramId] === option.selectedValue;
      });
    });
  }
}
