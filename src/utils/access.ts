export interface AccessSubject {
  roles: string[]
  permissions: string[]
}
export interface AccessRule {
  roles?: string[]
  permissions?: string[]
}
/** 角色任一满足，权限全部满足；* 仅在后端明确授予时生效。 */
export function hasAccess(subject: AccessSubject, rule: AccessRule): boolean {
  const roles = rule.roles ?? []
  const permissions = rule.permissions ?? []
  return (
    (!roles.length || roles.some(role => subject.roles.includes(role))) &&
    (!permissions.length ||
      subject.permissions.includes('*') ||
      permissions.every(permission => subject.permissions.includes(permission)))
  )
}
export function safeRedirect(value: unknown, fallback = '/home'): string {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    Array.from(value).some(char => char.charCodeAt(0) <= 32) ||
    /^\/login(?:[/?#]|$)/i.test(value)
  )
    return fallback
  return value
}
