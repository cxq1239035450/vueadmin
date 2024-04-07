<template>
  <div class="layoutPage">
    <Menu class="w-200px"></Menu>
    <div class="flex-1">
      <Header></Header>
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import Menu from './components/menu.vue'
import Header from './components/header.vue'
</script>

<style scoped lang="scss">
.layoutPage {
  display: flex;
  height: 100%;
}
</style>
