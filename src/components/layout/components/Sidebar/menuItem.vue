<template>
  <template v-for="item in menuList" :key="item.path">
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title
        ><el-icon><component :is="getIcon(item.meta?.icon)" /></el-icon
        ><span>{{ item.meta?.title }}</span></template
      >
      <MenuItem :menu-list="item.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.path">
      <el-icon><component :is="getIcon(item.meta?.icon)" /></el-icon>
      <template #title>{{ item.meta?.title }}</template>
    </el-menu-item>
  </template>
</template>
<script setup lang="ts">
import { House, MagicStick, Menu, Setting, User } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
defineProps<{ menuList: RouteRecordRaw[] }>()
const icons: Record<string, Component> = {
  House,
  Setting,
  User,
  Menu,
  'ep-magic-stick': MagicStick,
}
const getIcon = (icon?: string) => icons[icon || 'Menu'] || Menu
</script>
