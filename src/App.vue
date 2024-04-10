<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
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
