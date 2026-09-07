<template>
  <el-result
    :icon="code === '403' ? 'warning' : 'info'"
    :title="code"
    :sub-title="
      code === '403'
        ? '你没有访问此页面的权限，请联系管理员。'
        : '页面不存在，请检查地址或返回工作台。'
    "
  >
    <template #extra
      ><el-button type="primary" @click="$router.push('/home')"
        >返回工作台</el-button
      ></template
    >
  </el-result>
</template>
<script setup lang="ts">
withDefaults(defineProps<{ code?: string }>(), { code: '404' })
</script>
