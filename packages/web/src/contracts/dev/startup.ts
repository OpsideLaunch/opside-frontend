import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const StartupAddresses: Record<number, string> = {
  5700: '0x108E699ca5570D13C89FeE551Aa86D3ADde1FedF',
  57000: '0xc6Bc996320c16cB59f73410ab42eE1C589A0F70A'
}

const abi =
  '[{"inputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"bool","name":"used","type":"bool"}],"internalType":"struct Startup.Profile","name":"p","type":"tuple"}],"name":"createStartup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"getStartup","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"bool","name":"used","type":"bool"}],"internalType":"struct Startup.Profile","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStore","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newPrimary","type":"address"}],"name":"transferPrimary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newStore","type":"address"}],"name":"transferStore","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useStartupContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: StartupAddresses }
): {
  getContract: () => Contract
  createStartup: (
    p: [name: string, chainId: number | BigNumber, used: any],
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  getStartup: (
    name: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ [/** name */ string, /** chainId */ number | BigNumber, /** used */ any]]>
  getStore: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  owner: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  renounceOwnership: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  transferOwnership: (
    newOwner: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferPrimary: (
    newPrimary: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferStore: (
    newStore: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: StartupAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    createStartup: wrapTransaction({ ...getContractArgs.value, ...params }, 'createStartup'),
    getStartup: wrapTransaction({ ...getContractArgs.value, ...params }, 'getStartup'),
    getStore: wrapTransaction({ ...getContractArgs.value, ...params }, 'getStore'),
    owner: wrapTransaction({ ...getContractArgs.value, ...params }, 'owner'),
    renounceOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'renounceOwnership'
    ),
    transferOwnership: wrapTransaction(
      { ...getContractArgs.value, ...params },
      'transferOwnership'
    ),
    transferPrimary: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferPrimary'),
    transferStore: wrapTransaction({ ...getContractArgs.value, ...params }, 'transferStore')
  }
}
