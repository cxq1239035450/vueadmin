<template>
  <div class="app">
    <keep-alive :include="[]">
      <router-view />
    </keep-alive>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.app {
  height: 100%;
  width: 100%;
  background: var(--primary-background-color);
}
.cursor {
  cursor: pointer;
}
</style>
