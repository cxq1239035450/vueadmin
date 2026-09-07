<template>
  <PageContainer title="用户管理" description="管理成员信息、角色与账号状态">
    <template #actions>
      <el-tag v-if="appConfig.demo" type="info" effect="plain"
        >演示数据 · 仅保存在本机</el-tag
      >
      <el-button
        v-if="can('user:create')"
        type="primary"
        :icon="Plus"
        @click="openForm()"
        >新增用户</el-button
      >
    </template>
    <div class="surface">
      <el-form class="search-form" :inline="true" @submit.prevent="search">
        <el-form-item label="关键词"
          ><el-input
            v-model="query.keyword"
            placeholder="用户名 / 邮箱"
            clearable
        /></el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="query.status"
            placeholder="全部状态"
            clearable
            style="width: 140px"
          >
            <el-option label="启用" value="enabled" /><el-option
              label="停用"
              value="disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          ><el-button type="primary" native-type="submit" :icon="Search"
            >查询</el-button
          ><el-button :icon="Refresh" @click="reset"
            >重置</el-button
          ></el-form-item
        >
      </el-form>
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="list-error"
      >
        <el-button link type="primary" @click="load">重新加载</el-button>
      </el-alert>
      <el-table
        v-loading="loading"
        :data="rows"
        row-key="id"
        empty-text="暂无匹配的用户"
        style="width: 100%"
      >
        <el-table-column prop="username" label="用户名" min-width="150" />
        <el-table-column prop="email" label="邮箱" min-width="210" />
        <el-table-column label="角色" width="110"
          ><template #default="{ row }">{{
            row.role === 'admin' ? '管理员' : '只读成员'
          }}</template></el-table-column
        >
        <el-table-column label="状态" width="100"
          ><template #default="{ row }"
            ><el-tag
              :type="row.status === 'enabled' ? 'success' : 'info'"
              effect="light"
              >{{ row.status === 'enabled' ? '启用' : '停用' }}</el-tag
            ></template
          ></el-table-column
        >
        <el-table-column label="创建日期" width="140"
          ><template #default="{ row }">{{
            new Date(row.createdAt).toLocaleDateString('zh-CN')
          }}</template></el-table-column
        >
        <el-table-column
          v-if="can('user:update') || can('user:delete')"
          label="操作"
          width="140"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              v-if="can('user:update')"
              link
              type="primary"
              @click="openForm(row as AdminUser)"
              >编辑</el-button
            >
            <el-button
              v-if="can('user:delete')"
              link
              type="danger"
              :disabled="deleting === row.id"
              @click="remove(row as AdminUser)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="query.page"
          :page-size="query.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          :pager-count="5"
          @current-change="changePage"
          @size-change="changeSize"
        />
      </div>
    </div>
    <el-dialog
      v-model="visible"
      :title="editingId === undefined ? '新增用户' : '编辑用户'"
      width="min(480px, calc(100vw - 32px))"
      :close-on-click-modal="false"
      :close-on-press-escape="!saving"
      :show-close="!saving"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="submit"
      >
        <el-form-item label="用户名" prop="username"
          ><el-input v-model="form.username" maxlength="30"
        /></el-form-item>
        <el-form-item label="邮箱" prop="email"
          ><el-input v-model="form.email" maxlength="100"
        /></el-form-item>
        <el-form-item label="角色" prop="role"
          ><el-select v-model="form.role" class="full-width"
            ><el-option label="管理员" value="admin" /><el-option
              label="只读成员"
              value="viewer" /></el-select
        ></el-form-item>
        <el-form-item label="状态"
          ><el-radio-group v-model="form.status"
            ><el-radio value="enabled">启用</el-radio
            ><el-radio value="disabled">停用</el-radio></el-radio-group
          ></el-form-item
        >
      </el-form>
      <template #footer
        ><el-button :disabled="saving" @click="visible = false">取消</el-button
        ><el-button type="primary" :loading="saving" @click="submit"
          >保存</el-button
        ></template
      >
    </el-dialog>
  </PageContainer>
</template>
<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { Plus, Refresh, Search } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import { useTable } from '@/composables/useTable'
import { usePermission } from '@/composables/usePermission'
import { listUsers, saveUser, deleteUser } from '@/api/system-users'
import { appConfig } from '@/config/app'
import type { AdminUser, UserForm } from '@/types/table'
const { can } = usePermission()
const {
  query,
  rows,
  total,
  loading,
  error,
  load,
  search,
  reset,
  changePage,
  changeSize,
} = useTable(listUsers, { page: 1, pageSize: 10, keyword: '', status: '' })
const visible = ref(false)
const saving = ref(false)
const deleting = ref<AdminUser['id']>()
const editingId = ref<AdminUser['id']>()
const formRef = ref<FormInstance>()
const defaults = (): UserForm => ({
  username: '',
  email: '',
  role: 'viewer',
  status: 'enabled',
})
const form = reactive<UserForm>(defaults())
const rules: FormRules = {
  username: [
    {
      required: true,
      whitespace: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效邮箱', trigger: 'blur' },
  ],
}
async function openForm(row?: AdminUser) {
  editingId.value = row?.id
  Object.assign(
    form,
    row
      ? {
          username: row.username,
          email: row.email,
          role: row.role,
          status: row.status,
        }
      : defaults()
  )
  visible.value = true
  await nextTick()
  formRef.value?.clearValidate()
}
async function submit() {
  if (saving.value || !(await formRef.value?.validate().catch(() => false)))
    return
  saving.value = true
  try {
    await saveUser({ ...form }, editingId.value)
    visible.value = false
    ElMessage.success('保存成功')
    await load()
  } catch (cause) {
    ElMessage.error(cause instanceof Error ? cause.message : '保存失败')
  } finally {
    saving.value = false
  }
}
async function remove(row: AdminUser) {
  if (deleting.value !== undefined) return
  try {
    await ElMessageBox.confirm(`确认删除用户“${row.username}”？`, '删除用户', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  deleting.value = row.id
  try {
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    await load()
  } catch (cause) {
    ElMessage.error(cause instanceof Error ? cause.message : '删除失败')
  } finally {
    deleting.value = undefined
  }
}
</script>
<style scoped>
.search-form {
  padding-bottom: 4px;
}
.pagination {
  margin-top: 24px;
  overflow-x: auto;
  display: flex;
  justify-content: flex-end;
}
.list-error {
  margin-bottom: 16px;
}
.full-width {
  width: 100%;
}
</style>
