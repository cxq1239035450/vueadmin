<template>
  <aside
    class="sidebar"
    :class="{ collapsed: store.isCollapse, 'mobile-open': store.mobileOpen }"
  >
    <Logo :collapse="store.isCollapse" />
    <el-scrollbar
      ><el-menu
        :default-active="route.meta.activeMenu || route.path"
        :collapse="store.isCollapse"
        :unique-opened="true"
        router
        :collapse-transition="false"
        @select="store.mobileOpen = false"
      >
        <MenuItem :menu-list="routersStore.menuList" /> </el-menu
    ></el-scrollbar>
    <div class="sidebar-footer">
      {{ store.isCollapse ? 'VA' : '管理工作空间' }}
    </div>
  </aside>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import Logo from './logo.vue'
import MenuItem from './menuItem.vue'
import { useLayoutStore } from '@/store/layout'
import { useRoutersStore } from '@/store/routers'
const store = useLayoutStore()
const routersStore = useRoutersStore()
const route = useRoute()
</script>
<style scoped>
.sidebar {
  width: 224px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  transition: width 0.2s;
}
.sidebar.collapsed {
  width: 64px;
}
.sidebar :deep(.el-scrollbar) {
  flex: 1;
}
.sidebar :deep(.el-menu) {
  border: 0;
  padding: 12px 8px;
}
.sidebar :deep(.el-menu-item),
.sidebar :deep(.el-sub-menu__title) {
  border-radius: 6px;
  height: 46px;
  margin-bottom: 4px;
}
.sidebar :deep(.el-menu-item.is-active) {
  background: var(--el-color-primary-light-9);
  font-weight: 600;
}
.sidebar-footer {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  text-align: center;
  padding: 20px 8px;
  border-top: 1px solid var(--el-border-color-lighter);
}
@media (max-width: 760px) {
  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 20;
    transform: translateX(-100%);
    transition: transform 0.2s;
  }
  .sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>
