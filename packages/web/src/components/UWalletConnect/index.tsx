import { defineComponent } from 'vue'
import { default as UWalletConnect, UWalletConnectPropsType } from './WalletConnect'
import { useUserStore, useWalletStore, useGlobalConfigStore } from '@/stores'

const WalletConnectBlock = defineComponent({
  name: 'WalletConnectBlock',
  setup() {
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const globalConfigStore = useGlobalConfigStore()

    const onWalletClick: UWalletConnectPropsType['onClick'] = async type => {
      // mobile use WalletConnect
      if (!globalConfigStore.isLargeScreen) {
        type = 'WalletConnect'
      }
      const wallet = await walletStore.onSelectWallet(type)
      // wallet &&
      console.warn(wallet, userStore.logged, userStore.is_connected_wallet)
      if (wallet && (!userStore.logged || !userStore.is_connected_wallet)) {
        const loginRes = await userStore.loginWithWalletAddress(wallet)
        console.log('onWalletClick loginRes', loginRes)
        if (loginRes) {
          walletStore.resolveWalletConnect(!!wallet)
        } else {
          walletStore.disconnectWallet()
        }
      } else {
        walletStore.resolveWalletConnect(!!wallet)
      }
    }

    const updateModalOpened = (value: boolean) => {
      walletStore.connectModalOpened = value
    }

    return () => (
      <UWalletConnect
        show={walletStore.connectModalOpened}
        onUpdateShow={updateModalOpened}
        onClick={onWalletClick}
        onClose={() => {
          walletStore.closeConnectModal()
        }}
      />
    )
  }
})

export default WalletConnectBlock
