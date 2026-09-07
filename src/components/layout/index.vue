<template>
  <div class="layoutPage">
    <Menu></Menu>
    <div class="layout-content">
      <Header></Header>
      <div class="page-content">
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
.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-content {
  flex: 1;
  min-height: 0;
  padding: 15px;
  background: #f5f5f5;
}
</style>
