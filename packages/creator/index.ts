import { uuid } from "./utils";
import { SkuItem, PropertyValue } from "../core";
import cartesian from "./utils/cartesian";

export type PropertyValues = {
  name: string;
  key: string;
  values: PropertyValue[];
};
export type Columns<T> = {
  title: string;
  dataIndex: keyof T;
};
export type FloatProp = { name: string; value: PropertyValue };
export type Row = Partial<SkuItem> & { key: string | number };

const depCloneObject = <T>(obj: any): T => JSON.parse(JSON.stringify(obj));

export default class SkuCreator {
  private defaultProperties: PropertyValues[] = [];
  private properties: PropertyValues[] = [];
  private rows: Row[] = [];
  private cols: Columns<SkuItem>[] = [];

  constructor(skuList?: SkuItem[]) {
    if (Array.isArray(skuList)) {
      this.initProperties(skuList);
    }
  }

  private createSkuList() {
    const cols: Columns<SkuItem>[] = [];
    const rows: Row[] = [];
    const floatProps: FloatProp[][] = [];
    this.properties.forEach((prop) => {
      if (prop.name && prop.values.length) {
        const cartesianItem: FloatProp[] = [];
        prop.values.forEach((value) => {
          cartesianItem.push({
            name: prop.name,
            value,
          });
        });
        floatProps.push(cartesianItem);
        cols.push({
          title: prop.name,
          dataIndex: prop.name,
        });
      }
    });
    const cartesianProperties = cartesian(...floatProps);
    cartesianProperties.forEach((e: any, index: number) => {
      rows.push({
        key: index,
        skuId: uuid(),
        properties: Array.isArray(e) ? e : [e],
      });
    });
    this.rows = rows;
    this.cols = cols;

    return {
      rows: this.rows,
      cols: this.cols,
    };
  }

  /** 属性相关的函数 */
  public propertyHandlers = {
    add: () => {
      this.properties.push({
        name: "",
        key: uuid(),
        values: [],
      });
      return {
        ...this.createSkuList(),
        props: depCloneObject<PropertyValues[]>(this.properties),
      };
    },
    remove: (index: number) => {
      const ret = depCloneObject<PropertyValues[]>(this.properties);
      ret.splice(index, 1);
      return {
        ...this.createSkuList(),
        props: ret,
      };
    },
    onChangeName: (index: number, name: string) => {
      const ret = [...this.properties];
      ret[index].name = name;
      return {
        ...this.createSkuList(),
        props: depCloneObject<PropertyValues[]>(ret),
      };
    },
    onChangeValues: (index: number, values: PropertyValue[]) => {
      const ret = [...this.properties];
      ret[index].values = values;
      return {
        ...this.createSkuList(),
        props: depCloneObject<PropertyValues[]>(ret),
      };
    },
  };

  /** sku相关操作 */
  public skuHandlers: {
    onChangePrice: (sku: SkuItem, price: number) => void;
    onChangeHold: (sku: SkuItem, hold: number) => void;
    customHandler?: (sku: SkuItem, key: string, value: any) => void;
  } = {
    onChangePrice: (sku, price) => {
      const hitSku = this.rows.find((row) => row.skuId === sku.skuId);
      if (hitSku) {
        hitSku.price = price;
      }
      return this.rows;
    },
    onChangeHold: (sku, hold) => {
      const hitSku = this.rows.find((row) => row.skuId === sku.skuId);
      if (hitSku) {
        hitSku.hold = hold;
      }
      return this.rows;
    },
    customHandler: (sku, key, value) => {
      const hitSku = this.rows.find((row) => row.skuId === sku.skuId);
      if (hitSku) {
        hitSku[key] = value;
      }
      return this.rows;
    },
  };

  public initProperties(skuList: SkuItem[]) {
    skuList.forEach((sku) => {
      sku.properties.forEach((prop) => {
        if (prop.name && prop.value) {
          const currentProp = this.defaultProperties.find(
            (p) => p.name === prop.name
          );
          if (currentProp) {
            !currentProp.values?.some(
              (currentValue) => currentValue.text === prop.value.text
            ) &&
              currentProp.values.push({
                ...prop.value,
              });
          } else {
            this.defaultProperties.push({
              name: prop.name,
              key: uuid(),
              values: [prop.value],
            });
          }
        }
      });
    });
    this.properties = JSON.parse(JSON.stringify(this.defaultProperties));
    this.createSkuList();
  }
}
