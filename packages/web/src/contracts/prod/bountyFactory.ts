import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const BountyFactoryAddresses: Record<number, string> = {
  137: '0x2E68F383EEed7A47C9d8a15AEC7ef4990daC9450'
}

const abi =
  '[{"inputs":[],"name":"children","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_depositToken","type":"address"},{"internalType":"uint256","name":"_founderDepositAmount","type":"uint256"},{"internalType":"uint256","name":"_applicantDepositAmount","type":"uint256"},{"internalType":"uint256","name":"_applyDeadline","type":"uint256"}],"name":"createBounty","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getStore","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"childAddr","type":"address"}],"name":"isChild","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newFactory","type":"address"}],"name":"transferPrimary","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newStore","type":"address"}],"name":"transferStore","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

export function useBountyFactoryContract(
  params: Omit<GetContractArgs, 'abi'> = { addresses: BountyFactoryAddresses }
): {
  getContract: () => Promise<Contract>
  children: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ any]>
  createBounty: (
    _depositToken: string,
    _founderDepositAmount: number | BigNumber,
    _applicantDepositAmount: number | BigNumber,
    _applyDeadline: number | BigNumber,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  getStore: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  isChild: (
    childAddr: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[/**  */ any]>
  owner: (pendingText: string, waitingText: string, overrides?: any) => Promise<[/**  */ string]>
  renounceOwnership: (pendingText: string, waitingText: string, overrides?: any) => Promise<[]>
  transferOwnership: (
    newOwner: string,
    pendingText: string,
    waitingText: string,
    overrides?: any
  ) => Promise<[]>
  transferPrimary: (
    newFactory: string,
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
      addresses: BountyFactoryAddresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({ ...getContractArgs.value, ...params }),
    children: wrapTransaction({ ...getContractArgs.value, ...params }, 'children'),
    createBounty: wrapTransaction({ ...getContractArgs.value, ...params }, 'createBounty'),
    getStore: wrapTransaction({ ...getContractArgs.value, ...params }, 'getStore'),
    isChild: wrapTransaction({ ...getContractArgs.value, ...params }, 'isChild'),
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
