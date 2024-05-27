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
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="任务名称" width="180" />
      <el-table-column prop="description" label="任务详情" width="180" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column
        prop="status"
        label="任务状态"
        width="120"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template #default="scope"> </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
const data = reactive({
  queryParams: {
    jobName: '',
  },
  tableData: [],
})
const { queryParams, tableData } = toRefs(data)
</script>

<style scoped lang="scss"></style>
