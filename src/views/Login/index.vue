<template>
  <div class="centerPage">
    <div class="card">
      <div class="mb-20px">LoginPage</div>
      <el-form>
        <el-form-item>
          <el-input v-model="formData.username" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formData.password"
            placeholder="输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button class="w-100%" @click="loginBtn">登陆/注册</el-button>
      <div class="ft-12 mt-20px">
        注册或登录即代表您同意《用户协议》和《隐私协议》
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { anyObject } from '@/type/userType'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const demo: anyObject = {
  user: 'pass',
}
const formData = reactive({
  username: '',
  password: '',
})
const loginBtn = () => {
  if (demo[formData.username]) {
    ElMessage.success('登陆成功')
    userStore.setUserInfoStore()
  } else {
    ElMessage.error('密码错误')
  }
}
</script>

<style scoped lang="scss">
.card {
  width: 380px;
}
</style>
