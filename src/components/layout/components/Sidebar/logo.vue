<template>
  <div class="logoBox" :style="collapse?'width:64px':''">
    <transition name="collapse">
      <div v-if="collapse">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <span v-else class="sidebar-title">{{ title }}</span>
      </div>
      <div v-else>
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <span class="sidebar-title">{{ title }}</span>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import logo from '@/assets/vue.svg'
const props = defineProps<{
  collapse?: boolean
}>()
const title = 'xxxx管理系统'
const { collapse } = toRefs(props)
</script>

<style scoped lang="scss">
.logoBox {
  position: relative;
  width: 100%;
  height: 36px;
  text-align: center;
  overflow: hidden;
  & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }
}
.collapse-active {
  transition: opacity 1.5s;
}

.collapse-enter,
.collapse-leave-to {
  opacity: 0;
  width: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 260px;
  height: 100%;
}
</style>
