import { UButton, UCard, UModal } from '@comunion/components'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { defineComponent, PropType, reactive, ref, watch } from 'vue'
import { AdditionalInformation, AdditionalInformationRef } from './components/AdditionalInfomation'
import { Information, InformationRef } from './components/Information'
import { ReviewInfo } from './components/ReviewInfo'
import { VerifyTokenRef, VerifyToken } from './components/VerifyToken'
import { CrowdfundingInfo } from './typing'
import Steps, { StepProps } from '@/components/Step'
import { allNetworks } from '@/constants'
import { useErc20Contract, WESaleFactoryAddresses, useWESaleFactoryContract } from '@/contracts'
import { services } from '@/services'
import { useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { reportError } from '@/utils/sentry'

// 不能自动转移流动性的Chains
const manualListingChainIds = allNetworks
  .filter(item => !item.routers || !item.routers.length)
  .map(item => item.chainId)

const CreateCrowdfundingForm = defineComponent({
  name: 'CreateCrowdfundingForm',
  emits: ['cancel'],
  props: {
    stepOptions: {
      type: Array as PropType<StepProps[]>,
      required: true
    }
  },
  setup(props, ctx) {
    const contractStore = useContractStore()
    const erc20TokenContract = useErc20Contract()
    let crowdfundingContract = useWESaleFactoryContract()
    const walletStore = useWalletStore()
    const verifyTokenRef = ref<VerifyTokenRef>()
    const fundingInfoRef = ref<InformationRef>()
    const additionalInfoRef = ref<AdditionalInformationRef>()
    const modalVisibleState = ref(false)
    const toNextProcessing = ref(false)
    const crowdfundingInfo = reactive<CrowdfundingInfo>({
      chainId: undefined,
      current: 1,
      // first step
      startupId: undefined,
      startupName: '',
      title: '',
      sellTokenContract: '',
      sellTokenName: '',
      sellTokenSymbol: '',

      sellTokenDecimals: '',
      sellTokenSupply: '',
      teamWallet: '',
      listing: manualListingChainIds.includes(walletStore.chainId!)
        ? 'Manual Listing'
        : 'Auto Listing',
      // second step
      softCap: null,
      hardCap: null,
      listingRate: undefined,
      buyTokenContract: '',
      buyTokenName: '',
      buyTokenSymbol: '',
      totalSellToken: undefined,
      buyTokenDecimals: '',
      liquidityPercent: undefined,
      buyPrice: undefined,
      maxBuyAmount: undefined,
      minBuyAmount: undefined,
      sellTax: undefined,
      Router: null,
      startTime: undefined,
      endTime: undefined,
      sellTokenDeposit: 0,
      isRebaseToken: false,
      usingVestingContributor: true,
      firstRelease: 100,
      vestingPeriod: 0,
      tokenCycle: 0,
      // third step
      poster: '',
      youtube: '',
      detail: '',
      description: undefined
    })

    // reload contract and wallet store
    const initContract = () => {
      walletStore.init(true).then(() => {
        crowdfundingContract = useWESaleFactoryContract()
      })
    }

    watch(
      () => crowdfundingInfo.startupId,
      () => {
        if (crowdfundingInfo.startupId) {
          getFinanceSymbol(crowdfundingInfo.startupId)
        }
      }
    )
    // change to startup chain
    const getFinanceSymbol = async (startup_id: number) => {
      const { error, data } = await services['Startup@get-startup-info']({
        startup_id
      })
      if (!error) {
        netWorkChange(data.chain_id)
      }
    }
    const netWorkChange = async (value: number) => {
      if (walletStore.chainId !== value) {
        await walletStore.ensureWalletConnected()
        const result = await walletStore.wallet?.switchNetwork(value)
        if (!result) {
          closeDrawer()
        } else {
          initContract()
          crowdfundingInfo.sellTokenContract = ''
        }
      }
    }
    const showLeaveTipModal = () => {
      modalVisibleState.value = true
    }
    const toPreviousStep = () => {
      crowdfundingInfo.current -= 1
    }
    const toNext = () => {
      if (toNextProcessing.value) {
        return
      }
      toNextProcessing.value = true
      if (crowdfundingInfo.current === 1) {
        verifyTokenRef.value?.verifyTokenForm?.validate(error => {
          toNextProcessing.value = false
          if (!error) {
            crowdfundingInfo.current += 1
          }
        })
      } else if (crowdfundingInfo.current === 2) {
        fundingInfoRef.value?.crowdfundingInfoForm?.validate(error => {
          toNextProcessing.value = false
          if (!error) {
            crowdfundingInfo.current += 1
          }
        })
      } else if (crowdfundingInfo.current === 3) {
        additionalInfoRef.value?.additionalInfoForm?.validate(error => {
          toNextProcessing.value = false
          if (!error) {
            crowdfundingInfo.current += 1
          }
        })
      } else {
        return
      }
    }
    const closeDrawer = () => {
      modalVisibleState.value = false
      ctx.emit('cancel')
    }
    const contractSubmit = async () => {
      const approvePendingText = 'Apply for creating Launchpad contract on blockchain.'
      try {
        // get dcrowdfunding factory address
        const factoryAddress = WESaleFactoryAddresses[walletStore.chainId!]
        contractStore.startContract(approvePendingText)
        // approve sellToken to crowdfund factory contract
        const erc20Res = await erc20TokenContract(crowdfundingInfo.sellTokenContract!)
        const approveRes = await erc20Res.approve(
          factoryAddress,
          ethers.utils.parseUnits(
            String(crowdfundingInfo.totalSellToken),
            crowdfundingInfo.sellTokenDecimals
          )
        )
        await approveRes.wait()

        const contractRes: any = await crowdfundingContract.createSale(
          crowdfundingInfo.teamWallet,
          crowdfundingInfo.sellTokenContract!,
          crowdfundingInfo.buyTokenContract,
          [
            ethers.utils.parseUnits(
              crowdfundingInfo.buyPrice!.toString(),
              crowdfundingInfo.sellTokenDecimals
            ),
            crowdfundingInfo.listing === 'Auto Listing'
              ? ethers.utils.parseUnits(crowdfundingInfo.liquidityPercent!.toString(), 4)
              : 0,
            ethers.utils.parseUnits(
              crowdfundingInfo.minBuyAmount!.toString(),
              Number(crowdfundingInfo.buyTokenDecimals)
            ),
            ethers.utils.parseUnits(
              crowdfundingInfo.maxBuyAmount!.toString(),
              Number(crowdfundingInfo.buyTokenDecimals)
            ),
            ethers.utils.parseUnits(
              crowdfundingInfo.softCap!.toString(),
              Number(crowdfundingInfo.buyTokenDecimals)
            ),
            ethers.utils.parseUnits(
              crowdfundingInfo.hardCap!.toString(),
              Number(crowdfundingInfo.buyTokenDecimals)
            ),
            crowdfundingInfo.listing === 'Auto Listing'
              ? crowdfundingInfo.Router!
              : '0x0000000000000000000000000000000000000000',
            crowdfundingInfo.listing === 'Auto Listing'
              ? ethers.utils.parseUnits(
                  String(crowdfundingInfo.listingRate!),
                  crowdfundingInfo.sellTokenDecimals
                )
              : 0,
            dayjs(crowdfundingInfo.startTime).valueOf() / 1000,
            dayjs(crowdfundingInfo.endTime).valueOf() / 1000,
            ethers.utils.parseUnits(crowdfundingInfo.firstRelease!.toString(), 4),
            // 测试环境单位为分钟，方便测试
            // +crowdfundingInfo.vestingPeriod * 60,
            +crowdfundingInfo.vestingPeriod * 24 * 60 * 60,
            ethers.utils.parseUnits(crowdfundingInfo.tokenCycle!.toString(), 4),
            Number(crowdfundingInfo.buyTokenDecimals)
          ],
          'Create Launchpad contract on blockchain.',
          `Launchpad is creating`
        )
        await approveRes.wait()
        return contractRes
      } catch (e: any) {
        reportError(e as Error)
        console.error(e)
        contractStore.endContract('failed', { success: false })
      }
      return null
    }
    const postSubmit = async () => {
      try {
        console.log(crowdfundingInfo)
        const contractRes = await contractSubmit()
        console.log('contractRes==>', contractRes)

        if (!contractRes) return
        await services['SaleLaunchpad@create-sale-launchpad']({
          title: crowdfundingInfo.title,
          startup_id: crowdfundingInfo.startupId!,
          chain_id: walletStore.chainId!,
          tx_hash: contractRes.hash,
          poster: crowdfundingInfo.poster.url,
          description: crowdfundingInfo.description!,
          youtube: crowdfundingInfo.youtube,
          detail: crowdfundingInfo.detail
        })
        ctx.emit('cancel')
      } catch (error) {
        reportError(error as Error)
        console.error('error===>', error)
      }
    }
    const onSubmit = async () => {
      postSubmit()
    }
    ctx.expose({
      crowdfundingInfo,
      toPreviousStep,
      toNext,
      showLeaveTipModal,
      closeDrawer,
      onSubmit
    })
    return {
      crowdfundingInfo,
      modalVisibleState,
      verifyTokenRef,
      fundingInfoRef,
      additionalInfoRef,
      closeDrawer
    }
  },
  render() {
    return (
      <div>
        <div class="mx-35 mb-20">
          <Steps
            steps={this.stepOptions}
            current={this.crowdfundingInfo.current}
            classes={{ stepTitle: 'w-32 text-center' }}
            class="mt-4"
          />
        </div>
        {this.crowdfundingInfo.current === 1 && (
          <VerifyToken
            crowdfundingInfo={this.crowdfundingInfo}
            onCloseDrawer={this.closeDrawer}
            ref={(value: any) => (this.verifyTokenRef = value)}
          />
        )}
        {this.crowdfundingInfo.current === 2 && (
          <Information
            crowdfundingInfo={this.crowdfundingInfo}
            ref={(value: any) => (this.fundingInfoRef = value)}
          />
        )}
        {this.crowdfundingInfo.current === 3 && (
          <AdditionalInformation
            crowdfundingInfo={this.crowdfundingInfo}
            ref={(value: any) => (this.additionalInfoRef = value)}
          />
        )}
        {this.crowdfundingInfo.current === 4 && (
          <ReviewInfo crowdfundingInfo={this.crowdfundingInfo} />
        )}
        <UModal v-model:show={this.modalVisibleState} maskClosable={false}>
          <UCard
            style={{ width: '540px', '--n-title-text-color': '#000' }}
            size="huge"
            closable={true}
            onClose={() => (this.modalVisibleState = false)}
            title="Discard the changes?"
          >
            <div class="min-h-20 text-color2 u-h6">
              The action cannot be undone at once you click 'Yes'!
            </div>
            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (this.modalVisibleState = false)}
              >
                Cancel
              </UButton>
              <UButton type="primary" class="w-41" onClick={this.closeDrawer}>
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </div>
    )
  }
})

export default CreateCrowdfundingForm
