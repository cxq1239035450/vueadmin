const userInfos = {
  isLogin: true,
  permission: ['add', 'delete'],
  otherPermission: [],
}
function checkPermission(target: Function, propertyName?: any) {
  if (!userInfos.isLogin) {
    return alert('用户未登录')
  }
  target.prototype.getAddPermission = (): boolean => {
    return userInfos.permission.includes('add')
  }

  target.prototype.getDeletePermission = (): boolean => {
    return userInfos.permission.includes('delete')
  }

  target.prototype.getEditPermission = (): boolean => {
    return userInfos.permission.includes('edit')
  }
  target.prototype.getOtherPermission = (): object => {
    // 返回其他拥有的权限
    return userInfos.otherPermission.reduce((pre, next) => {
      pre[next as string] = true
      return pre
    }, {} as { [key: string]: boolean })
  }
}
@checkPermission
export class userEntity {
  getAddPermission!: () => boolean
  getDeletePermission!: () => boolean
  getEditPermission!: () => boolean
  getOtherPermission!: () => object
  constructor() {}
}
