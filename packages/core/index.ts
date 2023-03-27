import { SkuItem, Config, SpecItem, PriceRange } from "./types";
import { xorWith, isEqual } from "lodash";

export * from "./types";

export class CtSku {
  private data!: SkuItem[];
  private specs!: Record<string, SpecItem[]>;
  private fieldNames!: Config["fieldNames"];
  private priceRange!: PriceRange;
  private totalHold!: number;

  constructor({ data, config }: { data?: SkuItem[]; config?: Config }) {
    this.fieldNames = config?.fieldNames;
    data && this.init(data);
  }

  public get extraData() {
    return {
      priceRange: this.priceRange,
      totalHold: this.totalHold,
    };
  }

  public config(config: Config) {
    this.fieldNames = config.fieldNames;
  }
  public init(data: SkuItem[]) {
    this.data = data;
    this.specs = {};
    this.initSpecs();
    this.initSpecItemDisable();
    return this.getSpecs();
  }
  public getSpecs() {
    return { ...this.specs };
  }
  private initSpecs() {
    const { data: skuList, fieldNames } = this;
    let specs: Record<string, SpecItem[]> = {};
    let _totalHold = 0; // 计算总库存
    let _minPrice = skuList[0]?.price; // 最小价格
    let _maxPrice = 0; // 最大价格

    skuList.forEach((sku) => {
      _totalHold += sku[fieldNames?.hold ?? "hold"];
      _minPrice = Math.min(_minPrice, sku.price);
      _maxPrice = Math.max(_maxPrice, sku.price);

      sku.properties.forEach((p) => {
        if (!specs[p.name]) {
          specs[p.name] = [];
        }
        if (!specs[p.name].some((item) => item.value.text === p.value.text)) {
          specs[p.name].push({
            value: p.value,
            disable: false,
            selected: false,
          });
        }
      });
    });
    this.totalHold = _totalHold;
    this.priceRange = {
      max: _maxPrice,
      min: _minPrice ?? 0,
    };
    this.specs = specs;
  }

  private querySku(specKey?: string) {
    const { specs, data: skuList } = this;
    const selectedSpecs: {
      name: string;
      value: SkuItem["properties"][number]["value"];
    }[] = [];

    Object.keys(specs).forEach((specKey) => {
      const selectedSpecItem = specs[specKey].find(
        (specItem) => specItem.selected
      );
      if (!!selectedSpecItem) {
        selectedSpecs.push({
          name: specKey,
          value: selectedSpecItem.value,
        });
      }
    });

    // 在规格没有全选的情况下 不执行查询操作
    if (selectedSpecs.length !== Object.keys(specs).length) return null;

    const querySku = skuList.find(
      (sku) => !xorWith(selectedSpecs, sku.properties, isEqual).length
    );

    if (querySku && querySku[specKey ?? ""]) {
      return querySku[specKey ?? ""];
    } else if (querySku) {
      return querySku;
    } else {
      return null;
    }
  }

  private initSpecItemDisable() {
    const { specs, data: skuList, fieldNames } = this;
    Object.keys(specs).forEach((specKey) => {
      specs[specKey].forEach((specItem) => {
        const currentSpec = `${specKey}:${specItem.value.text}`;
        // 找到包含该路径点的且库存不为0的sku
        const querySku = skuList.find((sku) => {
          const hitCurrentSpecProperty = sku.properties.find(
            (sp) => `${sp.name}:${sp.value.text}` === currentSpec
          );
          return hitCurrentSpecProperty && !!sku[fieldNames?.hold ?? "hold"];
        });
        // 有找到不为0的sku则说明该规格值可点击反之不可点击
        specItem.disable = !querySku;
      });
    });
  }

  private skuCore(selectedSpecStrArray: string[], currentSpecKey?: string) {
    const { specs, data: skuList, fieldNames } = this;
    Object.keys(specs).forEach((specKey) => {
      if (specKey !== currentSpecKey) {
        // 找出改规格中选中的值
        const currentSpecSelectedItem = specs[specKey].find(
          (specItem) => specItem.selected
        );

        specs[specKey].forEach((specItem) => {
          // 判断当前的规格的值是否是已经选中的，如果是选中的，就不要判断是否可点击直接跳过循环
          if (!specItem.selected) {
            const _selectedSpecStrArray = [...selectedSpecStrArray];
            // 如果当前规格中有选中的值
            if (!!currentSpecSelectedItem) {
              const specItemIndex = _selectedSpecStrArray.findIndex(
                (_specStr) =>
                  _specStr ===
                  `${specKey}:${currentSpecSelectedItem.value.text}`
              );
              _selectedSpecStrArray.splice(specItemIndex, 1);
            }
            _selectedSpecStrArray.push(`${specKey}:${specItem.value.text}`);

            const _tmpSkuPath: SkuItem[] = [];
            // 找到包含当前选中的规格所组成的路径的全部sku
            skuList.forEach((sku) => {
              const hitPropertySpecStr = _selectedSpecStrArray.filter(
                (_specStr) =>
                  sku.properties.some(
                    (p) => `${p.name}:${p.value.text}` === _specStr
                  )
              );

              if (hitPropertySpecStr.length === _selectedSpecStrArray.length) {
                _tmpSkuPath.push(sku);
              }
            });
            const hasHoldPath = _tmpSkuPath.find(
              (sku) => sku[fieldNames?.hold ?? "hold"]
            );
            const isNotEmpty = hasHoldPath
              ? hasHoldPath[fieldNames?.hold ?? "hold"]
              : 0;
            specItem.disable = !isNotEmpty;
          }
        });
      }
    });
  }

  public specItemHandler(specKey: string, specItem: SpecItem) {
    const specs = this.specs;
    let isCancel = false;
    // 找到该规格对应的全部值
    const currentSpecValues = specs[specKey] ?? [];
    // 上一个在改规格中被选中的值
    const prevSelectedSpecValue = currentSpecValues.find(
      (_specValue) => _specValue.selected
    );
    // 当前要被选中的值
    const currentSpecValue = currentSpecValues.find(
      (_specValue) => specItem.value.text === _specValue.value.text
    );
    // 让上一个被选中的值为false
    prevSelectedSpecValue && (prevSelectedSpecValue.selected = false);

    if (currentSpecValue?.value.text === prevSelectedSpecValue?.value.text) {
      isCancel = true;
    } else {
      currentSpecValue && (currentSpecValue.selected = true);
    }

    // 找到有值被选中的全部规格
    const selectedSpecStrArray = Object.keys(specs)
      .filter((specKey) => specs[specKey].find((specItem) => specItem.selected))
      .reduce((prev: string[], currentSpecKey) => {
        return [
          ...prev,
          `${currentSpecKey}:${
            specs[currentSpecKey].find((spec) => spec.selected)?.value.text
          }`,
        ];
      }, []);

    if (isCancel && !selectedSpecStrArray.length) this.initSpecItemDisable();

    if (!!selectedSpecStrArray.length)
      this.skuCore(selectedSpecStrArray, specKey);

    return {
      specs: { ...specs },
      sku: this.querySku(),
    };
  }
}
