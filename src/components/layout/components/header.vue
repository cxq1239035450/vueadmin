<template>
  <div class="headerPage">
    <el-icon @click="store.toggleCollapse()" size="20" class="foldIcon">
      <ep-fold v-show="!isCollapse" class="color-black" />
      <ep-expand v-show="isCollapse" class="color-black" />
    </el-icon>
  </div>
</template>
<script setup lang="ts">
import { useLayoutStore } from '@/store/layout'

const store = useLayoutStore()
const isCollapse = computed(() => store.isCollapse)
</script>

<style scoped lang="scss">
.headerPage {
  width: 100%;
  background: white;
  color: white;
  border-bottom: 1px solid #dcdfe6;
  .foldIcon {
    padding: 8px;
    cursor: pointer;
    &:hover {
      background: #f5f7fa;
    }
  }
}
</style>
