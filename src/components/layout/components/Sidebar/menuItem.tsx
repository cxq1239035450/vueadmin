import { RouteRecordRaw } from 'vue-router'
import { defineComponent, PropType, h, resolveComponent } from 'vue'
// unplugin-icons 仅在构建时导入Icon  无法动态识别

export default defineComponent({
  name: 'menuItem',
  props: {
    menuList: {
      type: Array as PropType<RouteRecordRaw[]>,
      default: () => [],
    },
  },
  setup(props) {
    const renderMenuItem = (res: RouteRecordRaw): JSX.Element => {
      if (res.children && res.children.length > 0) {
        const Icon = res.meta?.icon ? resolveComponent(res.meta.icon as string) : null
        return (
          <ElSubMenu index={res.path}>
            {{
              title: () => (
                <>
                  <ElIcon>
                    {Icon && typeof Icon !== 'string' ? h(Icon) : <ep-menu />}
                  </ElIcon>
                  <span>{res.meta?.title}</span>
                </>
              ),
              default: () => res.children?.map(child => renderMenuItem(child)),
            }}
          </ElSubMenu>
        )
      }
      const Icon = res.meta?.icon ? resolveComponent(res.meta.icon as string) : null
      return (
        <ElMenuItem index={res.path}>
          <ElIcon>
            {Icon && typeof Icon !== 'string' ? h(Icon) : null}
          </ElIcon>
          {res.meta?.title}
        </ElMenuItem>
      )
    }

    return () => props.menuList.map(item => renderMenuItem(item))
  },
})
