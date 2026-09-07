<template>
  <div class="layout-page">
    <button
      v-if="store.mobileOpen"
      class="sidebar-overlay"
      aria-label="关闭导航"
      @click="store.mobileOpen = false"
    />
    <Menu />
    <div class="layout-body">
      <Header />
      <main class="main-content"><router-view /></main>
    </div>
  </div>
</template>
<script setup lang="ts">
import Menu from './components/Sidebar/index.vue'
import Header from './components/header.vue'
import { useLayoutStore } from '@/store/layout'
const store = useLayoutStore()
</script>
<style scoped>
.layout-page {
  display: flex;
  height: 100%;
  overflow: hidden;
}
.layout-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.main-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 28px;
  background: var(--el-bg-color-page);
}
.sidebar-overlay {
  display: none;
}
@media (max-width: 760px) {
  .main-content {
    padding: 18px 14px;
  }
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 19;
    background: #0006;
    border: 0;
  }
}
</style>
