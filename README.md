# 简介

将 css 中 px 转换为 rem 的 loader

# 使用方法

```js
const pxTransformLoader = require('px-transform-loader')

const pxTransformLoaderOptions = {
  rootPx: 12,
  precision: 4,
  roundingMethod: 'enter', //round:四舍五入 enter:进一
  min: 2
}

const pxTransformLoaderOptionsStr = Object.entries(pxTransformLoaderOptions)
  .map(x => `${x[0]}=${x[1]}`)
  .join('&')

module: {
  rules: [
    {
      test: /\.css$/,
      loader: pxTransformLoader,
      options: pxTransformLoaderOptions
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: `vue-style-loader!css-loader!px-transform-loader?${pxTransformLoaderOptionsStr}`,
          scss: `vue-style-loader!css-loader!px-transform-loader?${pxTransformLoaderOptionsStr}!sass-loader`
        }
      }
    }
  ]
}
```

# 参数说明

| 参数名         | 作用                                                 | 默认值 |
| :------------- | :--------------------------------------------------- | :----- |
| rootPx         | 设置根元素的 px 值                                   | 12     |
| precision      | 精度                                                 | 4      |
| roundingMethod | 舍入方法（round：四舍五入；enter：进一）             | enter  |
| min            | 最小转换值（类似于 1px 的 border，一般不希望被转换） | 2      |
