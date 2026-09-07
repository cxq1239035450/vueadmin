<template>
  <div>
    <el-form
      size="small"
      :inline="true"
      label-width="68px"
      @submit.prevent="getList"
    >
      <el-form-item label="用户名">
        <el-input v-model="username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" native-type="submit"
          >搜索</el-button
        >
        <el-button :icon="Refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="filteredUsers" class="full-width">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="username" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { getUserList } from '@/api/user'
import type { User } from '@/types/api'

const username = ref('')
const users = ref<User[]>([])
const filteredUsers = computed(() =>
  users.value.filter(user => user.username.includes(username.value.trim()))
)

const getList = async () => {
  try {
    users.value = (await getUserList()).data
  } catch {
    // 请求层统一显示接口错误。
  }
}

const reset = () => {
  username.value = ''
  return getList()
}

onMounted(getList)
</script>
