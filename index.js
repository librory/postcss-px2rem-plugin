var css = require('css')
var validateOptions = require('schema-utils')
var postcss = require('postcss')

const defaultOptions = {
  rootPx: 12,
  precision: 4,
  roundingMethod: 'enter', //round:四舍五入 enter:进一
  min: 2,
}

const _replaceCb = (value, { rootPx, precision, roundingMethod, min } = {}) => {
  if (value < min) return value + 'px'

  const roundFn = roundingMethod === 'enter' ? Math.ceil : Math.floor
  const coeffient = Math.pow(10, precision)
  const ret = roundFn((value / rootPx) * coeffient) / coeffient + 'rem'

  return ret
}

const schema = {
  type: 'object',
  properties: {
    rootPx: { type: ['number', 'string'] },
    precision: { type: ['number', 'string'] },
    roundingMethod: { type: 'string' },
    min: { type: ['number', 'string'] },
  },
}

const transformer = (source, inputOptions) => {
  validateOptions(schema, inputOptions)

  const options = { ...defaultOptions, ...inputOptions }

  let ast = css.parse(source)
  ast.stylesheet.rules.forEach((rule) => {
    if (rule.type !== 'rule') return

    rule.declarations.forEach((declaration) => {
      if (!declaration.value) return

      declaration.value = declaration.value.replace(/([\d\.]+)px/g, (...item) =>
        _replaceCb(Number(item[1]), options),
      )
    })
  })
  return css.stringify(ast)
}

module.exports = postcss.plugin('postcss-px2rem', function (options) {
  return function (css, result) {
    var oldCssText = css.toString()
    var newCssText = transformer(oldCssText, options)
    var newCssObj = postcss.parse(newCssText)
    result.root = newCssObj
  }
})
