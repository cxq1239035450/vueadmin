<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="username" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { getUserList } from '@/api/user'
const data = reactive({
  queryParams: {
    jobName: '',
  },
  tableData: [],
})
const getList = () => {
  getUserList({}).then(res => {
    data.tableData = res as any
  })
}
const { queryParams, tableData } = toRefs(data)
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss"></style>
