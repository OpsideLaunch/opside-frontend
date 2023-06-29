import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '@/assets/logo.png'
import ShareOutlined from '@/assets/shareOutlined.svg'

export default defineComponent({
  name: 'DefaultHeader',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const path = computed(() => route.path)

    const menus = computed(() => [
      {
        name: 'Home',
        route: '/'
      },
      {
        name: 'Incubator',
        route: '/Incubator'
      },
      {
        name: 'Docs',
        link: 'https://docs.weconomy.network/'
      },
      {
        name: 'Media Kit',
        link: 'https://drive.google.com/drive/folders/1jkjbfJTOydaAwniMYHMo4LliF5_eyK6E?usp=sharing'
      },
      {
        name: 'Contact',
        route: '/Contact'
      }
    ])

    const handleClick = (item: any) => {
      if (item.link) {
        window.open(item.link)
      } else if (item.route) {
        router.push(item.route)
      }
    }

    return {
      path,
      menus,
      handleClick
    }
  },
  render() {
    return (
      <div class="bg-color-body top-0 z-10 overflow-hidden sticky">
        <div class="h-8 my-6 <lg:px-4">
          <img src={logo} class="h-full" />
        </div>
        <ul class="border-color-border flex border-t-1 border-b-1 font-600 h-13 text-color2 gap-10 items-center <lg:gap-0">
          {this.menus.map(item => (
            <li
              class={
                'cursor-pointer text-color2 hover:text-primary <lg:flex-1 <lg:text-center' +
                (this.path === item.route ? ' !text-color1' : '')
              }
              onClick={() => this.handleClick(item)}
            >
              {item.name}
              {item.link ? (
                <img
                  src={ShareOutlined}
                  class="h-3 -mt-0.5 ml-1 text-color3 w-3 inline-block align-middle"
                />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    )
  }
})
