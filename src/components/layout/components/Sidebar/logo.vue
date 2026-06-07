<template>
  <div class="logoBox">
    <router-link class="sidebar-logo-link" to="/">
      <img v-if="logo" :src="logo" class="sidebar-logo" />
      <h1 class="sidebar-title" :class="{ 'is-collapse': collapse }">{{ title }}</h1>
    </router-link>
  </div>
</template>
<script setup lang="ts">
import logo from '@/assets/vue.svg'
defineProps<{
  collapse?: boolean
}>()
const title = 'xxxx管理系统'
</script>

<style scoped lang="scss">
.logoBox {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 16px; /* 侧边对齐，更符合常规后台布局 */

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      margin-left: 12px;
      white-space: nowrap;
      
      /* 优化：使用 max-width 配合 opacity 实现平滑过渡 */
      transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s, margin-left 0.3s;
      opacity: 1;
      max-width: 160px; /* 给一个足够大的固定最大宽度 */
      overflow: hidden;
      
      &.is-collapse {
        max-width: 0;
        opacity: 0;
        margin-left: 0;
      }
    }
  }
}
</style>
