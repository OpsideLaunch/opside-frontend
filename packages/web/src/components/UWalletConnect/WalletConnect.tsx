import { UModal } from '@comunion/components'
import { CloseOutlined } from '@comunion/icons'
import type { ExtractPropTypes, PropType } from 'vue'
import { defineComponent, ref } from 'vue'
import './WalletConnect.css'
import IconCoinbaseWallet from './assets/wallet/CoinbaseWallet.png'
import IconMetaMask from './assets/wallet/MetaMask.png'
import IconSafepalWallet from './assets/wallet/SafepalWallet.png'
import IconTokenPocket from './assets/wallet/TokenPocket.png'
import IconTrustWallet from './assets/wallet/TrustWallet.png'
import IconWalletConnect from './assets/wallet/WalletConnect.png'
import { useGlobalConfigStore } from '@/stores'

export const UWalletConnectProps = {
  show: {
    type: Boolean,
    default: false
  },
  onUpdateShow: {
    type: Function as PropType<(v: boolean) => void>
  },
  onClick: {
    type: Function as PropType<
      (
        type:
          | 'MetaMask'
          | 'WalletConnect'
          | 'TrustWallet'
          | 'Coinbase Wallet'
          | 'Safepal Wallet'
          | 'TokenPocket'
      ) => void
    >
  },
  onClose: {
    type: Function as PropType<() => void>
  }
} as const

export type UWalletConnectPropsType = ExtractPropTypes<typeof UWalletConnectProps>

interface WalletItem {
  name:
    | 'MetaMask'
    | 'WalletConnect'
    | 'TrustWallet'
    | 'Coinbase Wallet'
    | 'Safepal Wallet'
    | 'TokenPocket'
  icon: string
  allowed: boolean
}

const UWalletConnect = defineComponent({
  name: 'UWalletConnect',
  props: UWalletConnectProps,
  setup(props) {
    const globalConfigStore = useGlobalConfigStore()

    const items = ref<WalletItem[]>([
      {
        name: 'MetaMask',
        icon: IconMetaMask,
        allowed: true
      },
      {
        name: 'Coinbase Wallet',
        icon: IconCoinbaseWallet,
        allowed: true
      },
      {
        name: 'WalletConnect',
        icon: IconWalletConnect,
        allowed: true
      },
      {
        name: 'TrustWallet',
        icon: IconTrustWallet,
        allowed: true
      },
      {
        name: 'Safepal Wallet',
        icon: IconSafepalWallet,
        allowed: false
      },
      {
        name: 'TokenPocket',
        icon: IconTokenPocket,
        allowed: false
      }
    ])

    return () => (
      <UModal
        show={props.show}
        onUpdateShow={props.onUpdateShow}
        maskClosable
        onMaskClick={props.onClose}
      >
        <div class="bg-color-body rounded-2xl max-w-[96%] py-8 px-14 w-145 relative !pb-12">
          <CloseOutlined class="u-wallet-connect__close-icon" onClick={props.onClose} />
          <p class="u-wallet-connect__subtitle">Connect to a wallet</p>
          <div
            class={`flex flex-wrap m-auto grid gap-4 ${
              globalConfigStore.isLargeScreen ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {items.value.map(item => (
              <div
                class={`${
                  globalConfigStore.isLargeScreen ? 'text-center p-4 ' : 'flex items-center px-4 '
                }u-wallet-connect__item border border-color-border rounded-sm bg-bg3 hover:bg-bg2 ${
                  item.allowed ? ' cursor-pointer' : ' cursor-not-allowed'
                } `}
                onClick={() => {
                  item.allowed && props.onClick?.(item.name)
                }}
              >
                <img src={item.icon} class="object-contain h-8 m-2 w-8 inline-block" />
                <div class={`flex-1 ${item.allowed ? '' : 'text-[c0c0c0]'}`}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </UModal>
    )
  }
})

export default UWalletConnect
