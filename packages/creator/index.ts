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
export type FlatProp = { name: string; value: PropertyValue };
export type Row = Partial<SkuItem> & { key: string | number };

const depCloneObject = <T>(obj: any): T => JSON.parse(JSON.stringify(obj));

export default class SkuCreator {
  private defaultProperties: PropertyValues[] = [];
  private properties: PropertyValues[] = new Proxy([], {
    set: (target: PropertyValues[], p: any, newValue) => {
      target[p] = newValue;
      return true;
    },
  });
  private rows: Row[] = [];
  private cols: Columns<SkuItem>[] = [];

  constructor(skuList?: SkuItem[]) {
    if (Array.isArray(skuList)) {
      this.initProperties(skuList);
    }
  }

  public getRenderData() {
    return {
      cols: this.cols,
      rows: this.rows,
      properties: this.properties,
    };
  }

  private createSkuList = () => {
    const cols: Columns<SkuItem>[] = [];
    const rows: Row[] = [];
    const flatProps: FlatProp[][] = [];
    this.properties?.forEach((prop) => {
      if (prop.name && prop.values.length) {
        const cartesianItem: FlatProp[] = [];
        prop.values.forEach((value) => {
          cartesianItem.push({
            name: prop.name,
            value,
          });
        });
        flatProps.push(cartesianItem);
        cols.push({
          title: prop.name,
          dataIndex: prop.name,
        });
      }
    });
    const cartesianProperties = cartesian(...flatProps);
    cartesianProperties?.forEach((e: any, index: number) => {
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
  };

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
      this.properties.splice(index, 1);
      return {
        ...this.createSkuList(),
        props: depCloneObject<PropertyValues[]>(this.properties),
      };
    },
    onChangeName: (index: number, name: string) => {
      this.properties[index].name = name;
      return {
        ...this.createSkuList(),
        props: depCloneObject<PropertyValues[]>(this.properties),
      };
    },
    onChangeValues: (index: number, values: PropertyValue[]) => {
      this.properties[index].values = values;
      return {
        ...this.createSkuList(),
        props: depCloneObject<PropertyValues[]>(this.properties),
      };
    },
  };

  /** sku相关操作 */
  public skuHandlers: {
    onChangePrice: (sku: SkuItem, price: number) => Row[];
    onChangeHold: (sku: SkuItem, hold: number) => Row[];
    customHandler?: (sku: SkuItem, key: string, value: any) => Row[];
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
