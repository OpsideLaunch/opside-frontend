import { defineComponent, ref } from 'vue'
import discord from '@/assets/discord.svg'
import github from '@/assets/github.svg'
import telegram from '@/assets/telegram.svg'
import twitter from '@/assets/twitter.svg'

export default defineComponent({
  name: 'Contact',
  setup() {
    const list = ref([
      {
        title: 'telegram',
        icon: telegram,
        link: 'https://t.me/WEconomyNetwork'
      },
      {
        title: 'twitter',
        icon: twitter,
        link: 'https://twitter.com/WEconomyNetwork'
      },
      {
        title: 'discord',
        icon: discord,
        link: 'https://discord.com/invite/zyM3G4pUCc'
      },
      {
        title: 'github',
        icon: github,
        link: 'https://github.com/comunion-io'
      }
    ])

    return {
      list
    }
  },
  render() {
    return (
      <div class="my-10 min-h-100 <lg:min-h-60 <lg:px-5">
        <ul class="flex gap-5 items-center">
          {this.list.map(item => (
            <li
              class="cursor-pointer bg-color1 h-16 text-center leading-16 w-16 hover:opacity-80"
              onClick={() => item.link && window.open(item.link)}
            >
              <img src={item.icon} class="h-8 w-8 inline-block" />
            </li>
          ))}
        </ul>
      </div>
    )
  }
})
