export type PropertyValue = {
  /** 唯一的值 unique */
  text: string;
  /** 可用于提示之类的 */
  other?: any;
  image?: string;
};
export type SkuItem = {
  hold: number;
  price: number;
  skuId: string;
  properties: {
    name: string;
    value: PropertyValue;
  }[];
  [other: string]: any;
};

export type SpecItem = {
  selected: boolean;
  value: SkuItem["properties"][number]["value"];
  disable?: boolean;
};

export type Config = {
  fieldNames?: {
    hold?: string;
  };
};

export type PriceRange = { min: number; max: number };
