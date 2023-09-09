import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'
// 创建axios 实例,将来对创建出来的实例，进行自定义配置
// 好处：不会污染原始的axios实例
const instance = axios.create({
  baseURL: 'http://cba.itlike.com/public/index.php?s=/api/',
  timeout: 5000
})

// 自定义配置

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
// 开启loading ,禁止背景点击（防止点击多次）

  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0
  })

  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  const res = response.data
  if (res.status !== 200) {
    // 提示
    Toast(res.message)
    // 抛出promise
    return Promise.reject(res.message)
    // 正确情况
  } else {
    Toast.clear()
  }

  return response.data
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})
// 导出配置好的实例
export default instance
