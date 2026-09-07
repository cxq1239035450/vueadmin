<template>
  <div class="centerPage">
    <div class="card">
      <div class="login-title">LoginPage</div>
      <el-form @submit.prevent="loginBtn">
        <el-form-item>
          <el-input v-model="formData.username" placeholder="账号" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="输入密码"
          />
        </el-form-item>
        <el-button class="full-width" native-type="submit" :loading="loading"
          >登陆/注册</el-button
        >
      </el-form>
      <div class="login-agreement">
        注册或登录即代表您同意《用户协议》和《隐私协议》
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const formData = reactive({ username: '', password: '' })

const loginBtn = async () => {
  if (loading.value) return
  loading.value = true
  try {
    await userStore.userLogin(formData)
    await router.push('/')
  } catch {
    // 请求层统一显示接口错误。
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.card {
  width: 380px;
}
.login-title {
  margin-bottom: 20px;
}
.login-agreement {
  font-size: 12px;
  margin-top: 20px;
}
</style>
