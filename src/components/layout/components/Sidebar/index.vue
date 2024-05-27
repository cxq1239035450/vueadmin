<template>
  <div>
    <Logo :collapse="isCollapse"></Logo>
    <el-menu
      class="menuClass"
      :default-active="menuActive"
      :collapse="isCollapse"
      :unique-opened="true"
      :router="true"
      @open="handleOpen"
      @close="handleClose"
    >
      <MenuItem :menuList="menuList" />
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import Logo from './logo.vue'
import MenuItem from './menuItem.tsx'
import { useLayoutStore } from '@/store/layout'
import { useRoutersStore } from '@/store/routers'
const store = useLayoutStore()
const routersStore = useRoutersStore()
const menuList = computed(() => routersStore.menuList)
const isCollapse = computed(() => store.isCollapse)

const route = useRoute()
const menuActive = computed(() => route.path)

const handleOpen = () => {}
const handleClose = () => {}
</script>

<style lang="scss">
.menuClass {
  width: 200px;
  height: calc(100% - 40px);
}
.logoBox {
  height: 40px;
}
</style>
