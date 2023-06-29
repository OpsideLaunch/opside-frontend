// windi.config.js
import ComponentConfig from '@comunion/components/windi.config'
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  ...ComponentConfig,
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}', 'public/**/*.html', 'index.html'],
    exclude: ['node_modules', '.git']
  },
  theme: {
    ...ComponentConfig.theme,
    extend: {
      // @ts-ignore
      ...ComponentConfig.theme.extend
    }
  },
  shortcuts: {
    ...ComponentConfig.shortcuts,
    'u-page-container': 'mx-auto max-w-168'
  }
})
