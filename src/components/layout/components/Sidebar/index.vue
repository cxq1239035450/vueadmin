<template>
  <div class="sidebar-container" :class="{ 'is-collapse': isCollapse }">
    <Logo :collapse="isCollapse"></Logo>
    <el-scrollbar>
      <el-menu
        class="menuClass"
        mode="vertical"
        :default-active="menuActive"
        :collapse="isCollapse"
        :unique-opened="true"
        :router="true"
        :collapse-transition="true"
      >
        <MenuItem :menu-list="menuList" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import Logo from './logo.vue'
import MenuItem from './menuItem.vue'
import { useLayoutStore } from '@/store/layout'
import { useRoutersStore } from '@/store/routers'
const store = useLayoutStore()
const routersStore = useRoutersStore()
const menuList = computed(() => routersStore.menuList)
const isCollapse = computed(() => store.isCollapse)

const route = useRoute()
const menuActive = computed(() => route.path)
</script>

<style lang="scss" scoped>
.sidebar-container {
  transition: width 0.3s;
  width: 200px !important;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.is-collapse {
    width: 64px !important;
  }

  :deep(.el-scrollbar) {
    flex: 1;
    .el-scrollbar__view {
      height: 100%;
    }
  }

  .menuClass {
    border: none;
    height: 100%;
    width: 100% !important;

    // 确保展开收起动画平滑
    &:not(.el-menu--collapse) {
      width: 200px !important;
    }
  }
}
</style>
<style lang="scss">
/* 全局样式处理 Element Plus 菜单动画 */
.horizontal-collapse-transition {
  transition: 0.3s width ease-in-out, 0.3s padding-left ease-in-out,
    0.3s padding-right ease-in-out !important;
}

.el-menu--collapse {
  width: 64px !important;
  .el-sub-menu__title {
    span {
      height: 0;
      width: 0;
      overflow: hidden;
      visibility: hidden;
      display: inline-block;
    }
    .el-sub-menu__icon-arrow {
      display: none;
    }
  }
}
</style>
