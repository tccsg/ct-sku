# 临时说明文档

### 目录结构

`core`：sku 选择器的核心代码

`examples`：提供部分框架的使用 demo，目前包含 react, vue, qwik, svelte

`platform`：部分框架封装后的 sku 选择器的组件，方便直接使用

### 仓库使用

在根目录运行

```
pnpm i
```

安装依赖

根目录运行

```
pnpm dev:react
```

代表 react 平台, dev:vue 就是 vue 平台。

或者进入对应 demo 目录运行

```
cd packages/examples/sku-react
pnpm dev
```
