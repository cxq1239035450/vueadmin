import { appConfig } from '@/config/app'
export const tokenStorage = {
  get: () => sessionStorage.getItem(`${appConfig.storagePrefix}:token`),
  set: (token: string) =>
    sessionStorage.setItem(`${appConfig.storagePrefix}:token`, token),
  clear: () => sessionStorage.removeItem(`${appConfig.storagePrefix}:token`),
}
