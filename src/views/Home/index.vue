<template>
  <div>homePage</div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { computed, reactive } from 'vue'
const userStore = useUserStore()
const a = reactive({
  info: computed(() => userStore.$state.info),
})
userStore.getUserInfoStore({})
</script>

<style>
</style>