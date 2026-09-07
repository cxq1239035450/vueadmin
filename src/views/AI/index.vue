<template>
  <div class="ai-chat-container">
    <el-card class="chat-card">
      <template #header>
        <div class="card-header">
          <span>AI 智能助手</span>
          <el-button
            type="danger"
            size="small"
            :disabled="isChatting || isLoadingHistory"
            :loading="isClearing"
            @click="clearMessages"
            >清空对话</el-button
          >
        </div>
      </template>

      <div ref="messageListRef" class="message-list">
        <div v-if="messages.length === 0" class="empty-state">
          <el-empty description="开始对话吧！" />
        </div>
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-item', msg.role]"
        >
          <div class="avatar">
            <el-avatar
              :size="32"
              :icon="msg.role === 'human' ? User : MagicStick"
            />
          </div>
          <div class="content">
            <div class="role-name">
              {{ msg.role === 'human' ? '我' : 'AI' }}
            </div>
            <div class="text-bubble">
              <div class="message-text">{{ msg.content }}</div>
              <div v-if="msg.loading" class="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-area">
        <el-input
          v-model="userInput"
          type="textarea"
          :rows="3"
          placeholder="请输入您的问题..."
          :disabled="isChatting || isClearing || isLoadingHistory"
          @keyup.enter.ctrl="sendMessage"
        />
        <div class="input-footer">
          <span class="tip">Ctrl + Enter 发送</span>
          <el-button
            type="primary"
            :loading="isChatting"
            :disabled="isClearing || isLoadingHistory"
            @click="sendMessage"
          >
            发送
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { MagicStick, User } from '@element-plus/icons-vue'
import {
  chat,
  clearChatHistory,
  getChatHistory,
  type ChatMessage,
} from '@/api/ai'
import { readChatStream } from '@/utils/stream'

const userInput = ref('')
const isChatting = ref(false)
const isClearing = ref(false)
const isLoadingHistory = ref(true)
const messages = ref<ChatMessage[]>([])
const messageListRef = ref<HTMLElement | null>(null)
const controller = new AbortController()

const scrollToBottom = async () => {
  await nextTick()
  const list = messageListRef.value
  if (list) list.scrollTop = list.scrollHeight
}

const clearMessages = async () => {
  if (isChatting.value || isClearing.value || isLoadingHistory.value) return
  isClearing.value = true
  try {
    await clearChatHistory(controller.signal)
    messages.value = []
    ElMessage.success('会话已重置')
  } catch {
    if (!controller.signal.aborted) ElMessage.error('重置会话失败')
  } finally {
    isClearing.value = false
  }
}

const sendMessage = async () => {
  const question = userInput.value.trim()
  if (
    !question ||
    isChatting.value ||
    isClearing.value ||
    isLoadingHistory.value
  )
    return
  messages.value.push({ role: 'human', content: question })
  const history = messages.value.slice()
  messages.value.push({ role: 'ai', content: '', loading: true })
  const aiMessage = messages.value[messages.value.length - 1]
  userInput.value = ''
  isChatting.value = true

  try {
    await scrollToBottom()
    const body = await chat(history, controller.signal)
    for await (const content of readChatStream(body)) {
      aiMessage.loading = false
      aiMessage.content += content
      await scrollToBottom()
    }
  } catch {
    if (!controller.signal.aborted) {
      ElMessage.error('AI 响应出错，请稍后再试')
      if (!aiMessage.content) aiMessage.content = '抱歉，我现在无法回答。'
    }
  } finally {
    aiMessage.loading = false
    isChatting.value = false
  }
}

onMounted(async () => {
  try {
    messages.value = await getChatHistory(controller.signal)
    await scrollToBottom()
  } catch {
    if (!controller.signal.aborted) ElMessage.error('获取历史记录失败')
  } finally {
    isLoadingHistory.value = false
  }
})

onBeforeUnmount(() => controller.abort())
</script>

<style scoped lang="scss">
.ai-chat-container {
  padding: 20px;
  height: calc(100vh - 120px);
  display: flex;
  justify-content: center;

  .chat-card {
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 0;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }

  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: #f9f9f9;

    .empty-state {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .message-item {
      display: flex;
      margin-bottom: 20px;

      &.human {
        flex-direction: row-reverse;
        .content {
          align-items: flex-end;
          margin-left: 0;
          margin-right: 12px;
          .text-bubble {
            background-color: #409eff;
            color: white;
            border-radius: 12px 0 12px 12px;
          }
        }
      }

      &.ai {
        .content {
          margin-left: 12px;
          .text-bubble {
            background-color: white;
            color: #333;
            border-radius: 0 12px 12px 12px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
          }
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        max-width: 80%;

        .role-name {
          font-size: 12px;
          color: #999;
          margin-bottom: 4px;
        }

        .text-bubble {
          padding: 10px 15px;
          font-size: 14px;
          line-height: 1.6;
          word-break: break-all;
        }
      }
    }
  }

  .input-area {
    padding: 20px;
    border-top: 1px solid #ebeef5;
    background-color: white;

    .input-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;

      .tip {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.message-text {
  white-space: pre-wrap;
}

.loading-dots {
  display: inline-block;
  span {
    animation: blink 1.4s infinite both;
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
