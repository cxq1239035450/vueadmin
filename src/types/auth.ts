export interface UserInfo {
  id: number | string
  username: string
  nickname?: string
  roles: string[]
  permissions: string[]
}
/** 后端差异由 API 适配器转换；不默认授予管理员权限。 */
export function normalizeUser(value: unknown): UserInfo {
  if (!value || typeof value !== 'object') throw new Error('用户信息格式错误')
  const user = value as Record<string, unknown>
  if (typeof user.username !== 'string')
    throw new Error('用户信息缺少 username')
  const strings = (input: unknown) =>
    Array.isArray(input)
      ? input.filter((item): item is string => typeof item === 'string')
      : []
  return {
    id:
      typeof user.id === 'number' || typeof user.id === 'string'
        ? user.id
        : user.username,
    username: user.username,
    nickname: typeof user.nickname === 'string' ? user.nickname : undefined,
    roles: strings(user.roles),
    permissions: strings(user.permissions),
  }
}
