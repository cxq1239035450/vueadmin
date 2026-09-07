<template>
  <template v-for="item in menuList" :key="item.path">
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title>
        <el-icon><component :is="getIcon(item.meta?.icon)" /></el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <MenuItem :menu-list="item.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.path">
      <el-icon v-if="item.meta?.icon">
        <component :is="getIcon(item.meta.icon)" />
      </el-icon>
      <template #title>{{ item.meta?.title }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { MagicStick, Menu } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

defineProps<{ menuList: RouteRecordRaw[] }>()

const getIcon = (icon: unknown) =>
  icon === 'ep-magic-stick' ? MagicStick : Menu
</script>
