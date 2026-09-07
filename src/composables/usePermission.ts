import { useUserStore } from '@/store/user'
import { hasAccess } from '@/utils/access'
export function usePermission() {
  const store = useUserStore()
  const can = (permissions: string | string[]) =>
    !!store.info &&
    hasAccess(store.info, {
      permissions:
        typeof permissions === 'string' ? [permissions] : permissions,
    })
  const hasRole = (roles: string[]) =>
    !!store.info && hasAccess(store.info, { roles })
  return { can, hasRole }
}
