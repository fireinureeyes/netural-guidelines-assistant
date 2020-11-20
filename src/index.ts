import CoreAssistant from '@sketch-hq/sketch-core-assistant'
import { AssistantPackage, RuleDefinition, RuleUtils } from '@sketch-hq/sketch-assistant-types'
import _ from 'lodash'

import {
  getBackgroundColors,
  getBorderColors,
  getTextColors,
  getFontSizes,
  getBorderSizes,
  getFontFamilies,
  getLineHeights,
  getShadows,
  getOpacities,
  getRadiuses,
} from './token-utils'
import { strict } from 'assert'

//reserved for design system versioning
const RELEASE = ''

// parse rgba syntax and populate array
const parseColors = (rawTokens: Array<string>) =>
  rawTokens.map((key: string) => {
    let split = key.split(',').map((attr: string) =>
      parseFloat(
        attr
          .replace(/rgba|rgb/g, '')
          .replace(/\(/g, '')
          .replace(/\)/g, ''),
      ),
    )
    // add alpha of 1
    if (split.length < 4) split.push(1)
    return split
  })

// parse shadow syntax and populate array
const parseShadows = (rawTokens: Array<string>) =>
  rawTokens.map((key: string) => {
    let split = key.split(' ').map((attr: string) => attr)
    return split
  })

// turn rgba percentages into values
const getRgba = (colorObj: any) => {
  return [
    Math.round(255 * colorObj?.red),
    Math.round(255 * colorObj?.green),
    Math.round(255 * colorObj?.blue),
    colorObj?.alpha,
  ]
}

// global variables to make reporting hints with actual values possible
const fontFamilyValues = getFontFamilies()
const fontLineHeightValues = getLineHeights()
const fontSizeValues = getFontSizes()
const borderColorValues = getBorderColors()
const borderSizeValues = getBorderSizes()
const backgroundColorValues = getBackgroundColors()
const shadowValues = getShadows()
const opacityValues = getOpacities()
const radiusValues = getRadiuses()
const textColorValues = getTextColors()

// given sketch layer, return true if this layer should be linted
const isValidLayer = (layer: any, _utils: RuleUtils) => {
  return layer._class !== 'group' && layer._class !== 'page' && layer._class !== 'artboard'
}

const textFont: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.text) {
      const fontName =
        layer.style?.textStyle?.encodedAttributes?.MSAttributedStringFontAttribute?.attributes?.name
      if (typeof fontName !== 'string') throw Error()

      if (!fontFamilyValues.includes(fontName))
        utils.report(`'${fontName}' does not match a valid font name token`, layer)
    }
  },
  name: 'ds/font',
  title: `Fonts used should match the defined token values`,
  description: `Reports a violation if a font is different than: \r\n${fontFamilyValues.join(
    '\r\n',
  )}`,
}

const textLineHeight: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.text) {
      const fontLineHeight =
        layer.style?.textStyle?.encodedAttributes.paragraphStyle?.minimumLineHeight

      if (fontLineHeight)
        if (!fontLineHeightValues.find((v) => parseInt(v) === fontLineHeight))
          utils.report(
            `${fontLineHeight?.toString()} does not match a valid font line height token`,
            layer,
          )
    }
  },
  name: 'ds/lineheight',
  title: `Text line height should match the defined token values`,
  description: `Reports a violation if a line height is different than: \r\n${fontLineHeightValues.join(
    '\r\n',
  )}`,
}

const textSize: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.text) {
      const size =
        layer.style?.textStyle?.encodedAttributes?.MSAttributedStringFontAttribute?.attributes?.size
      if (isValidLayer(layer, utils) && !fontSizeValues.find((v) => parseInt(v) === size))
        utils.report(`${size} does not match a valid font size token`, layer)
    }
  },
  name: 'ds/text-size',
  title: `Font sizes should match the defined token values ${RELEASE}`,
  description: `Reports a violation if a font size is different than: \r\n${fontSizeValues.join(
    '\r\n',
  )}`,
}

const borderColor: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.anyLayer) {
      const borders = layer.style?.borders

      if (isValidLayer(layer, utils) && borders && borders.length > 0) {
        borders.forEach((border) => {
          const borderRgba = getRgba(border.color)

          // Border must be enabled. Transparent borders are allowed.
          if (
            border.isEnabled &&
            borderRgba[3] !== 0 &&
            !parseColors(borderColorValues).find((v) => _.isEqual(v, borderRgba))
          )
            utils.report(
              `rgba(${borderRgba}) does not match a valid border or generic color token`,
              layer,
            )
        })
      }
    }
  },
  name: 'ds/border-color',
  title: `Border colors should match border or generic color token values ${RELEASE}`,
  description: `Reports a violation if a border color is different than: \r\n${borderColorValues.join(
    '\r\n',
  )}`,
}

const borderSize: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.anyLayer) {
      const borders = layer.style?.borders

      if (isValidLayer(layer, utils) && borders && borders.length > 0) {
        borders.forEach((border) => {
          const borderPx = border.thickness

          // Border must be enabled. Transparent borders are allowed.
          if (border.isEnabled && !borderSizeValues.includes(borderPx.toString()))
            utils.report(`${borderPx} does not match a valid border size token`, layer)
        })
      }
    }
  },
  name: 'ds/border-size',
  title: `Border sizes should match the defined token values ${RELEASE}`,
  description: `Reports a violation if a border size is different than: \r\n${borderSizeValues.join(
    '\r\n',
  )}`,
}

const fillColor: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.anyLayer) {
      const fills = layer.style?.fills

      if (isValidLayer(layer, utils) && fills && fills.length > 0) {
        fills.forEach((fill) => {
          const fillRgba = getRgba(fill.color)

          // check for token match or transparency
          if (
            fill.isEnabled &&
            fillRgba[3] !== 0 &&
            !parseColors(backgroundColorValues).find((v) => _.isEqual(v, fillRgba))
          )
            utils.report(
              `rgba(${fillRgba}) does not match a valid background or generic color token`,
              layer,
            )
        })
      }
    }
  },
  name: 'ds/fill-color',
  title: `Fill colors should match background or generic color token values ${RELEASE}`,
  description: `Reports a violation if a fill color is different than: \r\n${backgroundColorValues.join(
    '\r\n',
  )}`,
}

const shadow: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.anyLayer) {
      const appliedShadows = layer.style?.shadows

      if (isValidLayer(layer, utils) && appliedShadows && appliedShadows.length > 0) {
        appliedShadows.forEach((shadow) => {
          if (shadow.isEnabled) {
            let isAllowed = false
            parseShadows(shadowValues).forEach((allowedShadow) => {
              const colours: string[] = []
              colours.push(allowedShadow[5])
              if (
                allowedShadow[0] == shadow.offsetX.toString() &&
                allowedShadow[1] == shadow.offsetY.toString() &&
                allowedShadow[2] == shadow.blurRadius.toString() &&
                allowedShadow[3] == shadow.spread.toString() &&
                allowedShadow[4] == shadow.contextSettings.blendMode.toString() &&
                parseColors(colours).find((v) => _.isEqual(v, getRgba(shadow.color)))
              )
                isAllowed = true
            })
            if (isAllowed == false)
              utils.report(
                `${shadow.offsetX.toString()} ${shadow.offsetY.toString()} ${shadow.blurRadius.toString()} ${shadow.spread.toString()} ${shadow.contextSettings.blendMode.toString()} rgba(${getRgba(
                  shadow.color,
                )}) does not match any defined token`,
                layer,
              )
          }
        })
      }
    }
  },
  name: 'ds/shadow',
  title: `Shadows should match defined token values ${RELEASE}`,
  description: `Reports a violation if a shadow is different than: \r\n${shadowValues.join(
    '\r\n',
  )}`,
}

const opacity: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.anyLayer) {
      const objectOpacity = layer.style?.contextSettings?.opacity
      if (
        !(objectOpacity == null) &&
        !(objectOpacity == undefined) &&
        isValidLayer(layer, utils) &&
        opacityValues &&
        opacityValues.length > 0
      ) {
        for (const opacity of opacityValues) {
          if (parseFloat(opacity) !== Math.round((objectOpacity + Number.EPSILON) * 100) / 100)
            utils.report(
              `${
                Math.round((objectOpacity + Number.EPSILON) * 100) / 100
              } Does not match a valid opacity token value`,
              layer,
            )
        }
      }
    }
  },
  name: 'ds/opacity',
  title: `Opacities should match defined token values ${RELEASE}`,
  description: `Reports a violation if an opacity is different than: \r\n${opacityValues.join(
    '\r\n',
  )}`,
}

const radius: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.anyLayer) {
      if (
        layer._class === 'triangle' ||
        layer._class === 'star' ||
        layer._class === 'shapePath' ||
        layer._class === 'rectangle' ||
        layer._class === 'polygon'
      ) {
        for (const point of layer.points) {
          if (
            point.curveMode == 1 &&
            !radiusValues.find((v) => _.isEqual(v, point.cornerRadius.toString()))
          ) {
            utils.report(
              `${layer.points.length} One or more path points does not match a valid radius token value`,
              layer,
            )
            break
          }
        }
      }
    }
  },
  name: 'ds/radius',
  title: `Radiuses should match defined token values ${RELEASE}`,
  description: `Reports a violation if a radius is different than: \r\n${radiusValues.join(
    '\r\n',
  )}`,
}

const textColor: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    for (const layer of utils.objects.text) {
      let colorAttribute =
        layer.style?.textStyle?.encodedAttributes.MSAttributedStringColorAttribute

      if (isValidLayer(layer, utils) && colorAttribute) {
        const textRgba = getRgba(colorAttribute)

        // check for token match or transparency
        if (textRgba[3] !== 0 && !parseColors(textColorValues).find((v) => _.isEqual(v, textRgba)))
          utils.report(
            `rgba(${textRgba[0]},${textRgba[1]},${textRgba[2]},${textRgba[3]}) does not match a valid text or generic color token`,
            layer,
          )
      }
    }
  },
  name: 'ds/text-color',
  title: `Text colors should match text or generic color token values ${RELEASE}`,
  description: `Reports a violation if a text color is different than: \r\n${textColorValues.join(
    '\r\n',
  )}`,
}

const textDisallow: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    const patterns = utils.getOption('pattern')
    if (!Array.isArray(patterns)) throw Error()

    for (const layer of utils.objects.text) {
      const value = layer.attributedString.string
      for (const pattern of patterns)
        if (value.toLowerCase().includes(pattern)) {
          utils.report(`Layer “${layer.name}” contains “${pattern}”`, layer)
        }
    }
  },
  name: 'netural-guidelines-assistant/text-disallow',
  title: (config) => `Text should not contain ${config.pattern}`,
  description: (config) => `Reports a violation if a text layer contains '${config.pattern}'`,
}

const namePatternTextStyle: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    const allowed = utils.getOption('allowed')
    if (typeof allowed !== 'string') throw Error()
    var re = new RegExp(allowed)

    for (const textStyles of utils.objects.sharedTextStyleContainer) {
      for (const textStyle of textStyles.objects) {
        if (!re.test(textStyle.name))
          utils.report(`Shared text style “${textStyle.name}” should follow the conventions`)
      }
    }
  },
  name: 'netural-guidelines-assistant/name-pattern-text-style',
  title: 'Shared text styles should follow the naming conventions',
  description: 'Reports a violation if a shared text style is named differently than defined',
}

/*
const namePatternFile: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    const allowed = utils.getOption('allowed')
    if (typeof allowed !== 'string') throw Error()

    utils.report(`Name Pattern Sketch File` + context.file.original.filepath)
  },
  name: 'netural-guidelines-assistant/name-pattern-file',
  title: 'Name Pattern Sketch File',
  description: 'Reports a violation if the sketch file is named differently than defined.',
}
*/

const assistant: AssistantPackage = [
  CoreAssistant,
  async () => {
    return {
      name: 'netural-guidelines-assistant',
      rules: [
        radius,
        opacity,
        shadow,
        fillColor,
        borderColor,
        borderSize,
        textColor,
        textSize,
        textFont,
        /*namePatternFile,*/
        textLineHeight,
        namePatternTextStyle,
        textDisallow,
      ],
      config: {
        rules: {
          'ds/radius': { active: true },

          'ds/opacity': { active: true },

          'ds/shadow': { active: true },

          'ds/fill-color': { active: true },

          'ds/border-color': { active: true },

          'ds/border-size': { active: true },

          'ds/text-color': { active: true },

          'ds/text-size': { active: true },

          'ds/font': { active: true },

          'ds/lineheight': { active: true },

          /*
          'netural-guidelines-assistant/name-pattern-file': {
            active: true,
            allowed: '^[a-z]{3}-[a-z]+-[0-9]{2}$',
          },
          */

          'netural-guidelines-assistant/text-disallow': {
            active: true,
            //patterns in lowercase, will be checked case insensitive
            pattern: ['lorem ipsum'],
          },

          //starts with three numbers
          //continues with a dash and at least one other character that is not _ or capital letter
          '@sketch-hq/sketch-core-assistant/name-pattern-artboards': {
            active: true,
            allowed: ['^[0-9]{3}-[^_^A-Z]*$'],
            forbidden: [],
            ruleTitle: 'Artboard names should follow the naming conventions',
          },

          //starts with one of the following: a/ m/ o/ c/
          //continues with at least one character that is not _ or capital letter
          '@sketch-hq/sketch-core-assistant/name-pattern-symbols': {
            active: true,
            allowed: ['^(a/|m/|o/|c/)[^_^A-Z]*$'],
            forbidden: [],
            ruleTitle: 'Symbol names should follow the naming conventions',
          },

          //starts with d- (desktop) or m- (mobile)
          //continues with H(+number) or body-(+number)
          //is further separated by /
          //continues with color name for up to 30 characters
          //is further separated by /
          //continues with alignement: left or center or right
          //is further separated by /
          //continues with a font weight that can be preceeded by a font name if separated by a dash (-)
          'netural-guidelines-assistant/name-pattern-text-style': {
            active: true,
            allowed:
              '^(d|m)-(H[0-9]|body-[0-9]{2,3})/[a-za-z0-9]{1,30}/(left|center|right)(/([a-z]{1,15}-)?(light|regular|medium|italic|semibold|semi-bold|bold|thin|black))?$',
          },
        },
      },
    }
  },
]

export default assistant
