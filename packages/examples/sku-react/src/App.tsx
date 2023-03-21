import { Button } from "antd";
import { useEffect, useState } from "react";
import "./App.css";
import SkuCreator from "./components/Creator";
import {
  CtSku,
  type SpecItem,
  type SkuItem,
  type PriceRange,
} from "@codetop-sku/core";

let tempSKus: any = [];
const mySku = new CtSku({});
const mockItemData = {
  title: "公司级Yeezy Boost V2 百搭轻便爆米花中底休闲运动慢跑鞋",
  minPrice: 1,
  itemId: "test-cs4gf-df5dg5e8je3nnc",
};
const App = () => {
  const [skus, setSkus] = useState<SkuItem[]>([]);
  const [specs, setSpecs] = useState<Record<string, SpecItem[]>>({});
  const [priceRange, setPriceRange] = useState<PriceRange>();
  const [totalHold, setTotalHold] = useState(0);
  const [currentSku, setCurrentSKu] = useState<SkuItem>();
  const confirmSkus = () => {
    setSkus([...tempSKus]);
  };

  const onTagClick = (k: any, o: any) => {
    const { specs, sku } = mySku.specItemHandler(k, o);
    console.log(specs, sku);
    setSpecs(specs);
    setCurrentSKu(sku);
  };

  useEffect(() => {
    const specs = mySku.init(skus);
    const { priceRange, totalHold } = mySku.extraData;
    setSpecs(specs);
    setTotalHold(totalHold);
    setPriceRange(priceRange);
  }, [skus]);
  return (
    <div className="app">
      <div className="sku-creator-wrap">
        <SkuCreator
          onChange={(skus) => {
            tempSKus = skus;
          }}
          skus={[]}
        />
        <Button type="primary" onClick={confirmSkus}>
          确认添加
        </Button>
      </div>
      <div style={{ background: "#f7f7f7" }}>
        <div className="sku-select-wrap">
          <div className="drawer-inner">
            <div className="prod-info">
              <div className="prod-img">
                <img
                  alt=""
                  src="https://xcimg.szwego.com/20230305/i1677951012_7683_0.jpg"
                />
              </div>
              <div className="content">
                <div className="item-title">{mockItemData.title}</div>
                <div>
                  <div className="price-wrap">
                    <span>¥{currentSku?.price ?? priceRange?.min}</span>
                    {/* {!canFlag && maxPrice > prodPrice ? <span>~ {maxPrice}</span> : null} */}
                  </div>
                  <div className="sku-hold">
                    库存 {currentSku?.hold ?? totalHold} 件
                  </div>
                </div>
              </div>
            </div>
            <div className="spec-inner">
              {Object.keys(specs).map((k, index) => {
                return (
                  <div key={`${index + 1}`} className="items">
                    <div className="title">{k}</div>
                    <div className="tags">
                      {specs[k].map((o: any, oi: any) => {
                        return (
                          <div
                            key={`${index + oi}`}
                            onClick={() => !o.disable && onTagClick(k, o)}
                            className={
                              o.selected
                                ? "tag active"
                                : o.disable
                                ? "tag disable"
                                : "tag"
                            }
                          >
                            {o.value.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {/* <div className="items">
                <div className="title">
                  数量
                  <div className="count-wrap">
                    <div className="sign" onClick={() => countChange('-')}>-</div>
                    <div className="count-box">{count}</div>
                    <div className="sign" onClick={() => countChange('+')}>+</div>
                  </div>
                </div>
              </div> */}
              <div className="btn-wrap">
                {/* <div className={canFlag ? "btn" : "btn disable"} onClick={onPressConfirmButton}>
                  确认
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
