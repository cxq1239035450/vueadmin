<template>
  <div class="headerPage">
    <el-icon size="20" class="foldIcon" @click="store.toggleCollapse()">
      <Fold v-if="!isCollapse" />
      <Expand v-else />
    </el-icon>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/store/layout'

const store = useLayoutStore()
const isCollapse = computed(() => store.isCollapse)
</script>

<style scoped lang="scss">
.headerPage {
  width: 100%;
  background: white;
  color: #000;
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
