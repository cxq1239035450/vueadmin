function checkPermission(target: Function, propertyName?: any) {
  console.log(target)
}
@checkPermission
export class userEntity {
  name!: boolean
  constructor() {}
}
