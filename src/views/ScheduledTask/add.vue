<template>
  <el-dialog v-model="visible" title="新增任务" width="30%">
    <el-form :model="form" label-position="top">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="请求地址">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="请求头">
        <el-input v-model="form.headers"></el-input>
      </el-form-item>
      <el-form-item label="请求内容">
        <el-input v-model="form.data"></el-input>
      </el-form-item>
      <el-form-item label="执行时间">
        <el-input v-model="form.executionTime"></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import type { Task } from '@/types/api'
const visible = ref(false)
const form = reactive({
  name: '',
  description: '',
  url: '',
  headers: '',
  data: '',
  executionTime: '',
})
const show = (item?: Task) => {
  visible.value = true
  form.name = item?.name ?? ''
  form.description = item?.description ?? ''
  form.executionTime = item?.executionTime ?? ''
  form.url = ''
  form.headers = ''
  form.data = ''
}
defineExpose({
  show,
})
</script>
