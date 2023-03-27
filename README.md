# 临时说明文档

### 目录结构

`core`：sku 选择器的核心代码

`examples`：提供部分框架的使用 demo，目前包含 react, vue, qwik, svelte

`platform`：部分框架封装后的 sku 选择器的组件，方便直接使用

### 仓库使用

1. 安装依赖在根目录运行

```
pnpm i
```

2. 运行 demo 在根目录运行（dev:对应框架）

```
pnpm dev:react
```

或者进入对应 demo 目录运行

```
cd packages/examples/sku-react
pnpm dev
```

### sku 选择器使用

`init`：如果实例化的时候没有初始化数据可调用这个方法初始化，返回解析后的规格

`config`：如果在实例化的时候没有配置可调用这个方法配置，目前只可配置库存和价格对应的 key {hold: '你自己的 key', price: '你自己的 key'}

`getSpecs`：获取解析后的规格

`extraData`：获取额外解析的数据，包含价格区间和总库存

`specItemHandler`：点击对应规格值的接口，第一个参数是对于的规格的名称，第二个参数是对于的规格值

```javascript
const mockData = [
  {
    id: 'xxx',
    skuId: 'xxxxxxx',
    properties: [
      {name: '颜色', value: {text: '红色'}},
      {name: '容量', value: {text: '32G'}}
    ],
    hold: 12,
    price: 2998
  },
  {
    id: 'xxx2',
    skuId: 'xxxxxxx2',
    properties: [
      {name: '颜色', value: {text: '白色'}},
      {name: '容量', value: {text: '64G'}}
    ],
    hold: 12,
    price: 3998
  }
]
// 实例化,可以在实例化时候初始化数据和配置，也可以在后面调用方法初始化和配置
const mySku = new CtSku({mockData, { fieldNames: { hold: 'kucun' } }})

// 初始化数据,返回解析后的规格
mySku.init(mockData)

// 配置
mySku.config({ fieldNames: { hold: 'kc' } })

// 获取解析后的规格
mySku.getSpecs()

// 额外解析的数据，包括价格区间，总库存
mySku.extraData

// 规格值点击的事件,返回解析后的规格和匹配到的sku没有匹配到返回null
mySku.specItemHandler('颜色', {
  selected: false;
  value: {text: '白色'};
  disable: false;
})
```
