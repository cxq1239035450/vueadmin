<template>
  <div class="logoBox">
    <transition name="collapse" mode="out-in">
      <span v-if="collapse">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <span v-else class="sidebar-title">{{ title }}</span>
      </span>
      <span v-else>
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <span class="sidebar-title">{{ title }}</span>
      </span>
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
.collapse-active {
  transition: all 0.2s;
}

.collapse-enter,
.collapse-leave-to {
  opacity: 0;
  width: 100%;
}
</style>
