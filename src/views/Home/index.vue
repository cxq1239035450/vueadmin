<template>
  <PageContainer title="工作台" description="欢迎回来，开始今天的工作。">
    <template #actions
      ><span class="today">{{ today }}</span></template
    >
    <div class="welcome surface">
      <div>
        <span class="eyebrow">YOUR WORKSPACE</span>
        <h2>你好，{{ user.info?.nickname || user.info?.username }}</h2>
        <p>所有常用入口，集中在一个地方。</p>
        <el-button
          v-if="can('user:read')"
          type="primary"
          @click="$router.push('/system/users')"
          >进入用户管理 <el-icon class="ml-8px"><ArrowRight /></el-icon
        ></el-button>
      </div>
      <div class="welcome-art" aria-hidden="true">
        <span>V</span><span>A</span>
      </div>
    </div>
    <div class="home-grid">
      <section class="surface">
        <h3>快捷入口</h3>
        <router-link v-if="can('user:read')" to="/system/users" class="shortcut"
          ><el-icon :size="22"><User /></el-icon>
          <div>
            <strong>用户管理</strong>
            <p>查看成员、管理角色与状态</p>
          </div>
          <el-icon><ArrowRight /></el-icon
        ></router-link>
        <el-empty v-else description="暂无可用业务入口" :image-size="64" />
      </section>
      <section class="surface">
        <h3>当前账号</h3>
        <dl>
          <dt>用户名</dt>
          <dd>{{ user.info?.username }}</dd>
          <dt>角色</dt>
          <dd>{{ user.info?.roles.join('、') || '未分配' }}</dd>
          <dt>环境</dt>
          <dd>{{ appConfig.demo ? '本地演示' : '业务环境' }}</dd>
        </dl>
      </section>
    </div>
    <el-alert
      v-if="appConfig.demo"
      title="你正在使用演示环境"
      description="用户列表的修改仅保存在本机浏览器，不会影响演示登录账号。可退出登录后使用只读账号体验权限差异。"
      type="info"
      show-icon
      :closable="false"
    />
  </PageContainer>
</template>
<script setup lang="ts">
import { User, ArrowRight } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer.vue'
import { useUserStore } from '@/store/user'
import { usePermission } from '@/composables/usePermission'
import { appConfig } from '@/config/app'
const user = useUserStore()
const { can } = usePermission()
const today = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'full' }).format(
  new Date()
)
</script>
<style scoped>
.today {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36px;
  margin-bottom: 24px;
  border-top: 3px solid var(--el-color-primary);
}
.eyebrow {
  color: var(--el-color-primary);
  letter-spacing: 2px;
  font-size: 11px;
  font-weight: 700;
}
h2 {
  font-size: 28px;
  margin: 14px 0;
}
h3 {
  font-size: 15px;
  margin: 0 0 22px;
}
p {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.welcome p {
  margin-bottom: 24px;
}
.welcome-art {
  display: flex;
  padding: 20px;
  color: var(--el-color-primary);
  font-weight: 800;
  font-size: 90px;
  letter-spacing: -20px;
  opacity: 0.18;
}
.home-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}
.shortcut {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 18px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  color: var(--el-text-color-primary);
}
.shortcut:hover {
  background: var(--el-color-primary-light-9);
}
.shortcut div {
  flex: 1;
}
.shortcut p {
  margin: 6px 0 0;
  font-size: 12px;
}
dl {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 18px;
  font-size: 14px;
}
dt {
  color: var(--el-text-color-secondary);
}
dd {
  margin: 0;
}
@media (max-width: 760px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
  .welcome {
    padding: 24px;
  }
  .welcome-art {
    display: none;
  }
}
</style>
