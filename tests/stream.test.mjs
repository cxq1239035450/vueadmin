import assert from 'node:assert/strict'
import test from 'node:test'
import { readChatStream } from '../src/utils/stream.ts'

const encoder = new TextEncoder()

function streamOf(chunks) {
  return new ReadableStream({
    start(controller) {
      chunks.forEach(chunk =>
        controller.enqueue(
          typeof chunk === 'string' ? encoder.encode(chunk) : chunk
        )
      )
      controller.close()
    },
  })
}

async function collect(stream) {
  const chunks = []
  for await (const chunk of readChatStream(stream)) chunks.push(chunk)
  return chunks.join('')
}

test('decodes UTF-8 characters and JSON across arbitrary network chunks', async () => {
  const data = encoder.encode('data: {"data":"你好🌏"}\r\n\r\ndata: [DONE]\n')
  const result = await collect(
    streamOf(Array.from(data, byte => Uint8Array.of(byte)))
  )
  assert.equal(result, '你好🌏')
})

test('handles plain text, JSON strings, and the final line without a newline', async () => {
  assert.equal(
    await collect(
      streamOf([
        'event: message\ndata: hello\n\ndata: " world"\ndata: {"data":"!"}',
      ])
    ),
    'hello world!'
  )
})

test('ignores comments and empty payloads', async () => {
  assert.equal(
    await collect(
      streamOf([
        ': keepalive\ndata:\ndata: null\ndata: {"data":null}\ndata: {}\n',
      ])
    ),
    ''
  )
})

test('DONE stops reading and cancels the remaining response', async () => {
  let cancelled = false
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode('data: first\ndata: [DONE]\ndata: ignored\n')
      )
    },
    cancel() {
      cancelled = true
    },
  })
  assert.equal(await collect(stream), 'first')
  assert.equal(cancelled, true)
  assert.equal(stream.locked, false)
})

test('empty responses finish normally', async () => {
  assert.equal(await collect(streamOf([])), '')
})

test('stream failures propagate and release the reader', async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.error(new Error('connection lost'))
    },
  })
  await assert.rejects(collect(stream), /connection lost/)
  assert.equal(stream.locked, false)
})

test('stopping consumption releases and cancels the reader', async () => {
  let cancelled = false
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('data: first\n'))
    },
    cancel() {
      cancelled = true
    },
  })
  for await (const content of readChatStream(stream)) {
    assert.equal(content, 'first')
    break
  }
  assert.equal(cancelled, true)
  assert.equal(stream.locked, false)
})
