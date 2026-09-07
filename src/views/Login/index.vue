<template>
  <main class="login-page">
    <section class="login-brand">
      <div class="brand-mark">V<span>A</span></div>
      <p class="eyebrow">WORKSPACE / ADMIN</p>
      <h1>从这里，<br />开始高效工作。</h1>
      <p class="brand-description">
        一个清晰、有序的管理空间。<br />连接你的团队、数据与日常工作。
      </p>
      <div class="brand-foot">{{ appConfig.title }}</div>
    </section>
    <section class="login-panel">
      <div class="login-form">
        <span class="eyebrow">WELCOME BACK</span>
        <h2>登录 {{ appConfig.title }}</h2>
        <p class="subtitle">请输入账号信息，进入管理工作台。</p>
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          :closable="false"
          class="login-error"
        />
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-position="top"
          size="large"
          @submit.prevent="loginBtn"
        >
          <el-form-item label="账号" prop="username"
            ><el-input
              v-model="formData.username"
              placeholder="请输入账号"
              autocomplete="username"
          /></el-form-item>
          <el-form-item label="密码" prop="password"
            ><el-input
              v-model="formData.password"
              type="password"
              show-password
              placeholder="请输入密码"
              autocomplete="current-password"
          /></el-form-item>
          <el-button
            class="login-button"
            type="primary"
            native-type="submit"
            :loading="loading"
            >登录</el-button
          >
        </el-form>
        <div v-if="appConfig.demo" class="demo-box">
          <strong>体验演示账号</strong>
          <p>密码均为 123456，演示数据保存在当前浏览器。</p>
          <el-button size="small" @click="fillAccount('admin')"
            >管理员</el-button
          >
          <el-button size="small" @click="fillAccount('viewer')"
            >只读成员</el-button
          >
        </div>
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/user'
import { appConfig } from '@/config/app'
import { safeRedirect } from '@/utils/access'
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const error = ref('')
const formRef = ref<FormInstance>()
const formData = reactive({ username: '', password: '' })
const rules: FormRules = {
  username: [
    {
      required: true,
      whitespace: true,
      message: '请输入账号',
      trigger: 'blur',
    },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
function fillAccount(username: string) {
  Object.assign(formData, { username, password: '123456' })
  error.value = ''
}
async function loginBtn() {
  if (loading.value || !(await formRef.value?.validate().catch(() => false)))
    return
  loading.value = true
  error.value = ''
  try {
    await userStore.userLogin({
      ...formData,
      username: formData.username.trim(),
    })
    await router.replace(safeRedirect(route.query.redirect))
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.login-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100dvh;
  background: var(--el-bg-color);
}
.login-brand {
  position: relative;
  padding: 72px 12%;
  background: #102c2c;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.brand-mark {
  position: absolute;
  top: 48px;
  font-size: 26px;
  font-weight: 750;
  letter-spacing: -3px;
}
.brand-mark span {
  color: #57c7ad;
}
.eyebrow {
  letter-spacing: 3px;
  font-size: 11px;
  color: #668a84;
  font-weight: 700;
}
.login-brand .eyebrow {
  color: #92c7b8;
}
.login-brand h1 {
  font-size: clamp(32px, 4vw, 56px);
  line-height: 1.35;
  letter-spacing: -2px;
  margin: 22px 0;
}
.brand-description {
  font-size: 15px;
  line-height: 1.9;
  color: #b2c8c2;
}
.brand-foot {
  position: absolute;
  bottom: 40px;
  color: #92ada5;
  font-size: 13px;
}
.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 28px;
}
.login-form {
  width: 100%;
  max-width: 380px;
}
h2 {
  margin: 14px 0 10px;
  font-size: 27px;
  letter-spacing: -1px;
}
.subtitle {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 36px;
}
.login-button {
  width: 100%;
  margin-top: 8px;
}
.demo-box {
  margin-top: 28px;
  padding: 18px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  font-size: 13px;
}
.demo-box p {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.7;
}
.login-error {
  margin-bottom: 20px;
}
@media (max-width: 760px) {
  .login-page {
    grid-template-columns: 1fr;
  }
  .login-brand {
    display: none;
  }
}
</style>
