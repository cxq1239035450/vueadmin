<template>
  <div class="ai-chat-container">
    <el-card class="chat-card">
      <template #header>
        <div class="card-header">
          <span>AI 智能助手</span>
          <el-button type="danger" size="small" @click="clearMessages">清空对话</el-button>
        </div>
      </template>
      
      <div class="message-list" ref="messageListRef">
        <div v-if="messages.length === 0" class="empty-state">
          <el-empty description="开始对话吧！" />
        </div>
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-item', msg.role]"
        >
          <div class="avatar">
            <el-avatar :size="32" :icon="msg.role === 'human' ? 'User' : 'MagicStick'" />
          </div>
          <div class="content">
            <div class="role-name">{{ msg.role === 'human' ? '我' : 'AI' }}</div>
            <div class="text-bubble">
              <div v-html="renderMarkdown(msg.content)"></div>
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
          @keyup.enter.ctrl="sendMessage"
          :disabled="isChatting"
        />
        <div class="input-footer">
          <span class="tip">Ctrl + Enter 发送</span>
          <el-button type="primary" :loading="isChatting" @click="sendMessage">
            发送
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface ChatMessage {
  role: 'human' | 'ai'
  content: string
  loading?: boolean
}

const userInput = ref('')
const isChatting = ref(false)
const messages = ref<ChatMessage[]>([])
const messageListRef = ref<HTMLElement | null>(null)

// 简单的 Markdown 渲染（实际项目中建议使用 markdown-it）
const renderMarkdown = (text: string) => {
  return text.replace(/\n/g, '<br/>')
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

const clearMessages = async () => {
  try {
    await fetch(`${import.meta.env.VITE_BASE_URL}/langchain/memory`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    messages.value = []
    ElMessage.success('会话已重置')
  } catch (error) {
    ElMessage.error('重置会话失败')
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isChatting.value) return

  const question = userInput.value.trim()
  messages.value.push({ role: 'human', content: question })
  userInput.value = ''
  
  isChatting.value = true
  const aiMessage: ChatMessage = { role: 'ai', content: '', loading: true }
  messages.value.push(aiMessage)
  
  await scrollToBottom()

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/langchain/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        messages: messages.value.slice(0, -1).map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    })

    if (!response.ok) {
      throw new Error('网络请求失败')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    aiMessage.loading = false

    if (reader) {
      let partialLine = ''
      const textQueue: string[] = []
      let isTyping = false

      // 使用当前的响应式消息引用
      const currentAiMessage = messages.value[messages.value.length - 1]

      const processQueue = () => {
        if (textQueue.length > 0) {
          isTyping = true
          const char = textQueue.shift()
          if (char !== undefined) {
            currentAiMessage.content += char
          }
          scrollToBottom()
          setTimeout(processQueue, 30) // 30ms 更有打字感
        } else {
          isTyping = false
          // 如果流已结束且队列也清空，则停止聊天状态
          if (readerDone) {
            isChatting.value = false
          }
        }
      }

      let readerDone = false
      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          readerDone = true
          break
        }
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = (partialLine + chunk).split('\n')
        partialLine = lines.pop() || ''
        
        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine || !trimmedLine.startsWith('data:')) continue
          
          const data = trimmedLine.substring(5).trim()
          if (data === '[DONE]') {
            readerDone = true
            break
          }
          
          try {
            // NestJS SSE 包装格式解析
            const parsed = JSON.parse(data)
            const content = typeof parsed === 'object' ? (parsed.data || '') : data
            
            if (content) {
              textQueue.push(...content.toString().split(''))
              if (!isTyping) processQueue()
            }
          } catch (e) {
            // 非 JSON 格式直接处理
            textQueue.push(...data.split(''))
            if (!isTyping) processQueue()
          }
        }
        if (readerDone) break
      }
      
      // 处理最后剩余部分
      if (partialLine.trim().startsWith('data:')) {
        const data = partialLine.trim().substring(5).trim()
        if (data && data !== '[DONE]') {
          textQueue.push(...data.split(''))
          if (!isTyping) processQueue()
        }
      }
    }
  } catch (error) {
    console.error('Chat Error:', error)
    ElMessage.error('AI 响应出错，请稍后再试')
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg && lastMsg.role === 'ai') {
      lastMsg.content = '抱歉，我现在无法回答。'
      lastMsg.loading = false
    }
    isChatting.value = false
  }
}

const fetchHistory = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/langchain/memory`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    if (!response.ok) throw new Error('获取历史记录失败')
    const res = await response.json()
    // NestJS 可能会包装响应，根据之前的拦截器逻辑，SSE 不包装但 GET 可能会包装
    const history = res.data?.chat_history || res.chat_history || []
    messages.value = history.map((item: any) => ({
      role: item.role === 'human' ? 'human' : 'ai',
      content: item.content
    }))
    await scrollToBottom()
  } catch (error) {
    console.error('Fetch History Error:', error)
  }
}

onMounted(() => {
  fetchHistory()
})
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
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
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

.loading-dots {
  display: inline-block;
  span {
    animation: blink 1.4s infinite both;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}
</style>
