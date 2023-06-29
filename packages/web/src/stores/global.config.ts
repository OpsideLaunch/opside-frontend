import { useMediaQuery } from '@vueuse/core'
import { defineStore } from 'pinia'
const isLargeScreen = useMediaQuery('(min-width: 1024px)')

export type GlobalConfigState = {
  // current theme, default: light
  theme: 'light' | 'dark'
}

export const useGlobalConfigStore = defineStore('globalConfig', {
  state: (): GlobalConfigState => ({
    theme: 'light'
  }),
  getters: {
    isLargeScreen: () => isLargeScreen.value
  },
  actions: {
    switchTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    }
  }
})
