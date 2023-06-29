import { defineComponent, ref } from 'vue'
import ShareOutlined from '@/assets/shareOutlined.svg'

export default defineComponent({
  name: 'homeContent',
  setup() {
    const list = ref([
      {
        title: 'A New Era of Blockchain Economy',
        content: `WEconomy is an all-in-one growth suite for empowering the blockchain economy with the power of coordinated growth offered by three components that helps chains, Dexs and projects grow organically and rapidly.`
      },
      {
        title: 'WELaunch',
        content: `An all-in-one blockchain projects launchpad, provides project launch, decentralized fundraising, on-chain governance and bounty that is devoted to helping buidlers launch their projects easily with non-code and zero costs.`,
        link: '//welaunch.work'
      },
      {
        title: 'WEChart',
        content: `A one-stop gateway of Defi provides real-time price charts and trading data analysis across multi-chains and Dexs that integrates many utility tools, including watchlist, DeFi portfolio tracker, notebook, price alert etc.`,
        link: '//wechart.io'
      },
      {
        title: 'WEDex',
        content: `A high performance DeFi aggregator that unites the liquidity of DEX and lending protocols with AI-Powered routing algorithm which across multi-chain, 100+ DEXes and thousands of token pairs to provide best price savings for investors.`,
        link: '//wedex.finance'
      },
      {
        title: 'GiveFi',
        content: `An easy, simple and smart to use Web3 marketing giveaway tool for helping team drive the growth of projects and community`,
        link: '//givefi.space'
      }
    ])

    return {
      list
    }
  },
  render() {
    return (
      <ul class="<lg:px-4">
        {this.list.map(item => (
          <li class="border-color-border border-b-1 py-9 last:border-b-0">
            <h2
              class={
                'font-600 text-base mb-2' +
                (item.link ? ' text-primary cursor-pointer hover:opacity-80' : ' text-color1')
              }
              onClick={() => item.link && window.open(item.link)}
            >
              {item.title}
              {item.link ? (
                <img
                  src={ShareOutlined}
                  class="h-3 -mt-1 ml-1 text-color3 w-3 inline-block align-middle"
                />
              ) : null}
            </h2>
            <div class="text-grey1 leading-5">{item.content}</div>
          </li>
        ))}
      </ul>
    )
  }
})
