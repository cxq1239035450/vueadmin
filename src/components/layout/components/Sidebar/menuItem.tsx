import { RouteRecordRaw } from 'vue-router'
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
        return (
          <ElSubMenu index={res.path}>
            {{
              title: () => (
                <>
                  <ElIcon>
                    <ep-menu />
                  </ElIcon>
                  <span>{res.meta?.title}</span>
                </>
              ),
              default: () => res.children?.map(child => renderMenuItem(child)),
            }}
          </ElSubMenu>
        )
      }
      return (
        <ElMenuItem index={res.path}>
          <ElIcon></ElIcon>
          {res.meta?.title}
        </ElMenuItem>
      )
    }

    return () => props.menuList.map(item => renderMenuItem(item))
  },
})
