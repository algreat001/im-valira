interface InternalItem<T = any> {
  value: any;
  raw: T;
  type?: string;
}

type FilterMatchArraySingle = readonly [ number, number ];
type FilterMatchArrayMultiple = readonly FilterMatchArraySingle[];
type FilterMatchArray = FilterMatchArraySingle | FilterMatchArrayMultiple;
type FilterMatch = boolean | number | FilterMatchArray;
type FilterFunction = (value: string, query: string, item?: InternalItem) => FilterMatch;

export type DataTableCompareFunction<T = any> = (a: T, b: T) => number | null;
export type HeaderCellPropsFunction = (data: any) => Record<string, any>;
export type SelectItemKey<T = Record<string, any>> =
  boolean
  | null
  | undefined
  | string
  | readonly (string | number)[]
  | ((item: T, fallback?: any) => any);


export interface TableHeader {
  readonly key?:
    | (string & {})
    | "data-table-group"
    | "data-table-select"
    | "data-table-expand"
    | undefined;
  readonly value?: SelectItemKey<any>;
  readonly title?: string | undefined;
  readonly fixed?: boolean | "start" | "end" | undefined;
  readonly align?: "start" | "end" | "center" | undefined;
  readonly width?: string | number | undefined;
  readonly minWidth?: string | number | undefined;
  readonly maxWidth?: string | number | undefined;
  readonly nowrap?: boolean | undefined;
  readonly headerProps?: { readonly [x: string]: any } | undefined;
  readonly cellProps?:
    | { readonly [x: string]: any }
    | HeaderCellPropsFunction
    | undefined;
  readonly sortable?: boolean | undefined;
  readonly sort?: DataTableCompareFunction<any> | undefined;
  readonly sortRaw?: DataTableCompareFunction<any> | undefined;
  readonly filter?: FilterFunction | undefined;
  readonly children?: readonly any[] | undefined;
}