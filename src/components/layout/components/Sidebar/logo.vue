<template>
  <router-link class="brand" to="/home" :title="appConfig.title">
    <span class="mark">V<span>A</span></span
    ><strong v-if="!collapse">{{ appConfig.title }}</strong>
  </router-link>
</template>
<script setup lang="ts">
import { appConfig } from '@/config/app'
defineProps<{ collapse?: boolean }>()
</script>
<style scoped>
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 64px;
  padding: 0 18px;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-lighter);
  white-space: nowrap;
  overflow: hidden;
}
.mark {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -4px;
  color: var(--el-color-primary);
  flex-shrink: 0;
  padding-right: 4px;
}
.mark span {
  opacity: 0.55;
}
strong {
  font-size: 16px;
  letter-spacing: -0.5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
