<template>
  <div class="layoutPage">
    <Menu></Menu>
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header></Header>
      <div class="flex-1 bg-#f5f5f5 p-15px h-100%">
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
