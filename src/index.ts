import CoreAssistant from '@sketch-hq/sketch-core-assistant'
import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'

const textDisallow: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    const pattern = utils.getOption('pattern')
    if (typeof pattern !== 'string') throw Error()

    for (const layer of utils.objects.text) {
      const value = layer.attributedString.string
      if (value.includes(pattern)) {
        utils.report(`Layer “${layer.name}” contains “${pattern}”`, layer)
      }
    }
  },
  name: 'netural-guidelines-assistant/text-disallow',
  title: (config) => `Text should not contain "${config.pattern}"`,
  description: (config) => `Reports a violation when text layers contain "${config.pattern}"`,
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
  description: 'Reports a violation if the sketch file is not named according to the definition.',
}
*/

const namePatternTextStyle: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    const allowed = utils.getOption('allowed')
    if (typeof allowed !== 'string') throw Error()
    var re = new RegExp(allowed)

    for (const textStyles of utils.objects.sharedTextStyleContainer) {
      for (const textStyle of textStyles.objects) {
        if (!re.test(textStyle.name))
          utils.report(`Shared style “${textStyle.name}” should follow the conventions.`)
      }
    }
  },
  name: 'netural-guidelines-assistant/name-pattern-text-style',
  title: 'Name Pattern Text Style',
  description: 'Reports a violation if a text style not named according to the definition.',
}

const assistant: AssistantPackage = [
  CoreAssistant,
  async () => {
    return {
      name: 'netural-guidelines-assistant',
      rules: [/*namePatternFile,*/ namePatternTextStyle, textDisallow],
      config: {
        rules: {
          'netural-guidelines-assistant/text-disallow': {
            active: true,
            pattern: 'Lorem ipsum',
          },

          /*
          'netural-guidelines-assistant/name-pattern-file': {
            active: true,
            allowed: '^[a-z]{3}-[a-z]+-[0-9]{2}$',
          },
          */

          //starts with three numbers
          //continues with a dash and at least one other character that is not _ or capital letter
          '@sketch-hq/sketch-core-assistant/name-pattern-artboards': {
            active: true,
            allowed: ['^[0-9]{3}-[^_^A-Z]*$'],
            forbidden: [],
          },

          //starts with one of the following: a/ m/ o/ c/
          //continues with at least one character that is not _ or capital letter
          '@sketch-hq/sketch-core-assistant/name-pattern-symbols': {
            active: true,
            allowed: ['^(a/|m/|o/|c/)[^_^A-Z]*$'],
            forbidden: [],
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
