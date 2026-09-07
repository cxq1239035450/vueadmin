<template>
  <div class="layoutPage">
    <Menu></Menu>
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header></Header>
      <div class="flex-1 min-h-0 p-15px bg-#f5f5f5">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Menu from './components/Sidebar/index.vue'
import Header from './components/header.vue'
</script>

<style scoped lang="scss">
.layoutPage {
  display: flex;
  height: 100%;
  overflow: hidden;
}
</style>
