import { BigNumber, ethers } from 'ethers'
import { reactive, onMounted } from 'vue'
import { useWESaleContract } from '@/contracts'
import { useWalletStore } from '@/stores'

export default function useInvestState(chainId: number, addresses: Record<number, string>) {
  const saleContract = useWESaleContract({ chainId, addresses })
  const walletStore = useWalletStore()
  const investState = reactive({
    isStarted: false,
    isCancel: false,
    isEnd: false,
    isLive: false,
    isFailed: false,
    isTransed: false,
    investedAmount: ethers.utils.parseUnits('0', 18),
    canClaimTotal: ethers.utils.parseUnits('0', 18),
    canClaim: ethers.utils.parseUnits('0', 18),
    unlockAt: 0,
    totalPreSale: ethers.utils.parseUnits('0', 18)
  })

  onMounted(async () => {
    const [isStarted, isFailed, isLive, isEnd, isCancel, isUnlock, investedAmount, totalPreSale] =
      await Promise.all([
        saleContract._isStarted('', ''),
        saleContract._isFailed('', ''),
        saleContract._isLive('', ''),
        saleContract._isEnded('', ''),
        saleContract._isCancel('', ''),
        saleContract.unlockedAt('', ''),
        saleContract.getInvestOf(walletStore.address!, '', ''),
        saleContract.totalPresale('', '')
      ])

    ;[investState.isStarted] = [isStarted].flat()
    ;[investState.isFailed] = [isFailed].flat()
    ;[investState.isLive] = [isLive].flat()
    ;[investState.isEnd] = [isEnd].flat()
    ;[investState.isCancel] = [isCancel].flat()
    investState.isTransed = ([isUnlock].flat()[0] as number) > 0
    investState.unlockAt = [isUnlock].flat()[0] as number
    investState.investedAmount = [investedAmount].flat()[0] as BigNumber
    investState.totalPreSale = [totalPreSale].flat()[0] as BigNumber

    if (!investState.investedAmount.isZero() && investState.isTransed) {
      const [canClaimTotal, canClaim] = await saleContract.getCanClaimTotal('', '')
      investState.canClaimTotal = canClaimTotal as BigNumber
      investState.canClaim = canClaim as BigNumber
    }
  })

  return investState
}
