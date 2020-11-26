//import * as primitiveTokens from './design-tokens/primitive.json'
import * as primitiveTokens from '@fireinureeyes/json'

//returns an array of allowed generic colors (category "color") from json file
const getGenericColors = () =>
  primitiveTokens.properties.filter((p) => p.category === 'color').map((p) => p.value)

//returns an array of allowed background colors and generic colors from json file
export const getFillColors = () =>
  primitiveTokens.properties
    .filter((p) => p.category === 'fill-color')
    .map((p) => p.value)
    .concat(getGenericColors())

//returns an array of allowed border colors and generic colors from json file
export const getBorderColors = () =>
  primitiveTokens.properties
    .filter((p) => p.category === 'border-color')
    .map((p) => p.value)
    .concat(getGenericColors())

//returns an array of allowed border sizes in px from json file
export const getBorderSizes = () =>
  primitiveTokens.properties
    .filter((p) => p.category === 'border-style' && p.type === 'size')
    .map((p) => p.value)

//returns an array of allowed text colors and generic colors from json file
export const getTextColors = () =>
  primitiveTokens.properties
    .filter((p) => p.category === 'text-color')
    .map((p) => p.value)
    .concat(getGenericColors())

//returns an array of allowed font sizes from json file
export const getFontSizes = () =>
  primitiveTokens.properties.filter((p) => p.category === 'font-size').map((p) => p.value)

//returns an array of allowed font families from json file
export const getFontFamilies = () =>
  primitiveTokens.properties
    .filter((p) => p.category === 'font' && p.type === 'font')
    .map((p) => p.value)

//returns an array of allowed line heights from json file
export const getLineHeights = () =>
  primitiveTokens.properties.filter((p) => p.category === 'line-height').map((p) => p.value)

//returns an array of allowed radiuses from json file
export const getRadiuses = () =>
  primitiveTokens.properties.filter((p) => p.category === 'radius').map((p) => p.value)

//returns an array of allowed opacities from json file
export const getOpacities = () =>
  primitiveTokens.properties.filter((p) => p.category === 'opacity').map((p) => p.value)

//returns an array of allowed shadows from json file
export const getShadows = () =>
  primitiveTokens.properties.filter((p) => p.category === 'shadow').map((p) => p.value)
