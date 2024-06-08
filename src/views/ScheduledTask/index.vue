<template>
  <div class="page">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
        >
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList()">搜索</el-button>
        <el-button>重置</el-button>
        <el-button @click="addBtn()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" class="w-100% flex-1">
      <el-table-column prop="name" label="任务名称" width="180" />
      <el-table-column prop="description" label="任务详情" width="180" />
      <el-table-column prop="executionTime" label="执行时间" width="180" />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
        align="center"
        :formatter="changeTime"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="任务状态"
        width="100"
        align="center"
        :formatter="statusFormat"
      ></el-table-column>
      <el-table-column
        prop="preExecutionTime"
        label="上次执行时间"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="executionResult"
        label="执行结果"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" @click="changeStatus(scope.row)">{{
            scope.row.status ? '暂停' : '启动'
          }}</el-button>
          <el-button size="small" @click="executeBtn(scope.row)"
            >立即执行</el-button
          >
          <el-button size="small" @click="editBtn(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:page-size="queryParams.pageSize"
      layout="prev, pager, next"
      :total="total"
    />
    <Add ref="addRef"></Add>
  </div>
</template>
<script setup lang="ts">
import { getTasksList, stopTask, startTask } from '@/api/task'
import { getTime } from '@/utils/time'
import Add from './add.vue'
const data = reactive({
  queryParams: {
    jobName: '',
    pageSize: 10,
  },
  tableData: [],
  total: 0,
})
const statusFormat = (ow: any, column: any, cellValue: 0 | 1) => {
  const o = {
    0: '未执行',
    1: '执行中',
  }
  return o[cellValue]
}
const changeTime = (ow: any, column: any, cellValue: Date) => {
  return getTime(cellValue)
}
const getList = () => {
  getTasksList(data.queryParams).then(res => {
    data.tableData = res.data.list
    data.total = res.data.total
  })
}
const addRef = ref<InstanceType<typeof Add> | null>(null)
const addBtn = () => {
  addRef.value?.show()
}
const editBtn = (item: any) => {
  addRef.value?.show(item)
}
const executeBtn = (item: any) => {
  startTask({ id: item.id }).then(res => {
    getList()
    ElMessage.success('执行成功')
  })
}
const changeStatus = (item: any) => {
  const apis = {}
}
onMounted(() => {
  getList()
})
const { queryParams, tableData, total } = toRefs(data)
</script>

<style scoped lang="scss">
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
