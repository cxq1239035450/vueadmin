<template>
  <section class="page-container">
    <header class="page-heading">
      <div>
        <h1>{{ title }}</h1>
        <p v-if="description">{{ description }}</p>
      </div>
      <div class="page-actions"><slot name="actions" /></div>
    </header>
    <slot />
  </section>
</template>
<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>
<style scoped>
.page-container {
  max-width: 1480px;
  margin: 0 auto;
}
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
}
p {
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
}
.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
