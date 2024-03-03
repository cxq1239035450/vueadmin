import axios from 'axios'
//  40871c14a12b4079b9b505de9a211af4
// 创建axios实例
const service = axios.create({
  baseURL: 'https://devapi.qweather.com/v7/weather/', // api的base_url
  timeout: 60000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
// request拦截器
service.interceptors.request.use((config):any=>{
  config.params = {...config.params,key:'40871c14a12b4079b9b505de9a211af4'}
  return config
},(error)=>{})
// respone拦截器
service.interceptors.response.use((response):any=>{
  return response
},(error)=>{})
export default service
