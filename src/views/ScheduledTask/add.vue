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
        <el-input type="headers" v-model="form.name"></el-input>
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
const data = reactive({
  visible: false,
})
const form = reactive({
  name: '',
  description: '',
  url: '',
  headers: {},
  data: '',
  executionTime: '',
})
const show = (item?: any) => {
  data.visible = true
  console.log(item)
}
defineExpose({
  show,
})
const { visible } = toRefs(data)
</script>

<style scoped lang="scss"></style>
