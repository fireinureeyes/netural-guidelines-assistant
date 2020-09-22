import CoreAssistant from '@sketch-hq/sketch-core-assistant'
import { AssistantPackage, RuleDefinition } from '@sketch-hq/sketch-assistant-types'

const namePatternArtboards: RuleDefinition = {
  rule: async (context) => {
    context.utils.report('Hello world')
  },
  name: 'netural-guidelines-assistant/name-pattern-artboards',
  title: 'Name Pattern Artboards',
  description: 'Reports a violation if an artboard is not named according to the definition.',
}

const textDisallow: RuleDefinition = {
  rule: async (context) => {
    const { utils } = context

    // Get a configuration option named "pattern"
    const pattern = utils.getOption('pattern')
    if (typeof pattern !== 'string') throw Error()

    // Iterate
    for (const layer of utils.objects.text) {
      const value = layer.attributedString.string
      // Test
      if (value.includes(pattern)) {
        // Report
        utils.report(`Layer “${layer.name}” contains “${pattern}”`, layer)
      }
    }
  },
  name: 'netural-guidelines-assistant/text-disallow',
  title: (config) => `Text should not contain "${config.pattern}"`,
  description: 'Reports a violation when text layers contain a configurable text pattern',
}

const assistant: AssistantPackage = [
  CoreAssistant,
  async () => {
    return {
      name: 'netural-guidelines-assistant',
      rules: [namePatternArtboards, textDisallow],
      config: {
        rules: {
          'netural-guidelines-assistant/name-pattern-artboards': { active: true },
          'netural-guidelines-assistant/text-disallow': { active: true, pattern: 'Lorem ipsum' },
          '@sketch-hq/sketch-core-assistant/groups-max-layers': {
            active: true,
            maxLayers: 3,
            skipClasses: ['artboard'],
          },
        },
      },
    }
  },
]

export default assistant
