import type { ProductParameter } from "@/interfaces/productParameter";

// Моковые данные товаров для магазина
export const newProduct: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8 // id новых товаров
];

export const productParameters: ProductParameter[] = [
  {
    product_parameter_id: "display",
    name: "Дисплей",
    description: "Тип и размер дисплея",
    type: "text"
  },
  {
    product_parameter_id: "memory",
    name: "Память",
    description: "Объем встроенной памяти",
    type: "number"
  },
  {
    product_parameter_id: "camera",
    name: "Камера",
    description: "Разрешение камеры",
    type: "text"
  },
  {
    product_parameter_id: "type",
    name: "Тип устройства",
    description: "Тип устройства (например, беспроводные)",
    type: "select",
    options: [ "Беспроводные", "Механическая" ]
  },
  {
    product_parameter_id: "battery",
    name: "Время работы",
    description: "Время автономной работы",
    type: "number"
  },
  {
    product_parameter_id: "screen",
    name: "Экран",
    description: "Размер экрана",
    type: "text"
  },
  {
    product_parameter_id: "ram",
    name: "ОЗУ",
    description: "Объем оперативной памяти",
    type: "number"
  },
  {
    product_parameter_id: "waterproof",
    name: "Влагозащита",
    description: "Степень влагозащиты",
    type: "text"
  },
  {
    product_parameter_id: "power",
    name: "Мощность",
    description: "Мощность устройс��ва",
    type: "number"
  },
  {
    product_parameter_id: "resolution",
    name: "Разрешение",
    description: "Разрешение экрана",
    type: "text"
  },
  {
    product_parameter_id: "backlight",
    name: "Подсветка",
    description: "Тип подсветки",
    type: "select",
    options: [ "RGB", "Белая" ]
  },
  {
    product_parameter_id: "dpi",
    name: "DPI",
    description: "Чувствительность мыши",
    type: "number"
  },
  {
    product_parameter_id: "buttons",
    name: "Кнопки",
    description: "Количество кнопок",
    type: "number"
  },
  {
    product_parameter_id: "capacity",
    name: "Объем",
    description: "Объем накопителя",
    type: "text"
  },
  {
    product_parameter_id: "interface",
    name: "Интерфейс",
    description: "Тип интерфейса",
    type: "text"
  },
  {
    product_parameter_id: "color",
    name: "Цвет",
    description: "Цвет товара",
    type: "color"
  },
  {
    product_parameter_id: "weight",
    name: "Вес",
    description: "Вес товара",
    type: "number"
  },
  {
    product_parameter_id: "material",
    name: "Материал",
    description: "Материал товара",
    type: "text"
  },
  {
    product_parameter_id: "brand",
    name: "Бренд",
    description: "Производитель товара",
    type: "text"
  },
  {
    product_parameter_id: "warranty",
    name: "Гарантия",
    description: "Срок гарантии на товар",
    type: "text"
  },
  {
    product_parameter_id: "features",
    name: "Особенности",
    description: "Дополнительные особенности товара",
    type: "text"
  },
  {
    product_parameter_id: "release_date",
    name: "Дата выпуска",
    description: "Дата выпуска товара",
    type: "date"
  },
  {
    product_parameter_id: "rating",
    name: "Рейтинг",
    description: "Рейтинг товара",
    type: "raiting"
  },
  {
    product_parameter_id: "size",
    name: "Размер",
    description: "Размер товара",
    type: "size"
  }
];
