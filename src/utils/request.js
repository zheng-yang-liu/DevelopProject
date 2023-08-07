// 框架
// 封装axios
import axios from 'axios'
import router from '@/router'
import elementUI from 'element-ui'

// 实例化
//创建一个axios实例如果在5秒内未响应，请求被取消
const a = axios.create({
  timeout: 5 * 1000,
})

// 其他需要操作的内容
// 拦截请求发出
a.interceptors.request.use((config) => {
  console.log('开始', config)
  // 改变头信息
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  console.log('结束', config)

  return config
})
// 拦截返回值success
a.interceptors.response.use(
  (success) => {
    if (success.data.code == 401) {
      router.push('/')
      return Promise.resolve('请登录') //返回的是错误的值catch
    } else if (success.data.code == 200) {
      elementUI.Message.success(success.data.msg)
      return Promise.resolve(success.data)
    } else if (success.data.code == 100) {
      elementUI.Message.error(success.data.msg)
      return Promise.resolve(success.data)
    } else {
      elementUI.Message.error('接口请求失败111')
      return Promise.reject(success.data.msg)
    }
  },
  (error) => {
    // 接口请求不同通过
    elementUI.Message.error('接口错误,请重试')
    return Promise.reject('接口请求错误')
  }
)

export default a
