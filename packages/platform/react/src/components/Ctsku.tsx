import {
  CtSku,
  type SkuItem,
  type Config,
  SpecItem,
  PriceRange,
} from "@codetop-sku/core";
import { useEffect } from "react";

const skuInstance = new CtSku({});

export interface CtskuProps {
  skuList: SkuItem[];
  config: Config;
  onChange?: (
    specs: Record<string, SpecItem[]>,
    extra?: { priceRange: PriceRange; totalHold: number }
  ) => void;
}
export const Ctsku = ({ skuList, config, onChange }: CtskuProps) => {
  useEffect(() => {
    const specs = skuInstance.init(skuList);
    const { priceRange, totalHold } = skuInstance.extraData;
    onChange?.(specs, { priceRange, totalHold });
  }, [skuList]);

  useEffect(() => {
    skuInstance.config(config);
  }, [config]);
  return null;
};
