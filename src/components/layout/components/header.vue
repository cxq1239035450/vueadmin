<template>
  <header class="app-header">
    <div class="header-start">
      <el-button
        text
        circle
        :aria-label="store.isCollapse ? '展开导航' : '折叠导航'"
        @click="store.toggleCollapse()"
        ><el-icon :size="20"
          ><Expand v-if="store.isCollapse" /><Fold v-else /></el-icon
      ></el-button>
      <el-breadcrumb separator="/"
        ><el-breadcrumb-item to="/home">工作台</el-breadcrumb-item
        ><el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">{{
          item.meta.title
        }}</el-breadcrumb-item></el-breadcrumb
      >
    </div>
    <div class="header-end">
      <el-tag
        v-if="appConfig.demo"
        class="mode-tag"
        size="small"
        type="info"
        effect="plain"
        >演示模式</el-tag
      >
      <el-button
        text
        circle
        :aria-label="store.dark ? '切换浅色主题' : '切换深色主题'"
        @click="store.toggleTheme()"
        ><el-icon :size="18"><Sunny v-if="store.dark" /><Moon v-else /></el-icon
      ></el-button>
      <el-dropdown @command="logout">
        <button class="user-menu">
          <span class="avatar">{{ displayName.slice(0, 1).toUpperCase() }}</span
          ><span>{{ displayName }}</span
          ><el-icon><ArrowDown /></el-icon>
        </button>
        <template #dropdown
          ><el-dropdown-menu
            ><el-dropdown-item command="logout"
              >退出登录</el-dropdown-item
            ></el-dropdown-menu
          ></template
        >
      </el-dropdown>
    </div>
  </header>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Expand, Fold, Moon, Sunny, ArrowDown } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/store/layout'
import { useUserStore } from '@/store/user'
import { appConfig } from '@/config/app'
const store = useLayoutStore()
const user = useUserStore()
const route = useRoute()
const router = useRouter()
const displayName = computed(
  () => user.info?.nickname || user.info?.username || '用户'
)
const breadcrumbs = computed(() =>
  route.matched.filter(item => item.meta.title && item.path !== '/home')
)
async function logout() {
  store.mobileOpen = false
  user.resetSession()
  await router.replace('/login')
}
</script>
<style scoped>
.app-header {
  min-height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
}
.header-start,
.header-end {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: none;
  color: var(--el-text-color-primary);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
}
.avatar {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 50%;
  font-weight: 600;
}
@media (max-width: 760px) {
  .app-header {
    padding: 0 12px;
  }
  .mode-tag {
    display: none;
  }
  .header-start,
  .header-end {
    gap: 4px;
  }
  :deep(.el-breadcrumb) {
    font-size: 12px;
  }
}
</style>
