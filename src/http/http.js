import axios from 'axios'
import { Message, Loading } from 'element-ui'
import router from '@/router'
/* nprogress 进度条 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 环境的切换,vue-cli3 开发就是dev,打包就是production
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = '/dev-api' //在config配置文件会代理到调试的后端代码主机
} else if (process.env.NODE_ENV == 'production') {
  // axios.defaults.baseURL = "http://47.107.146.154:30081";
  axios.defaults.baseURL = '/api' //在线上的nginx配置会代理到调试的后端代码所运行的主机
}

// 请求拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  return config
})

// 响应超时
axios.defaults.timeout = 90000
//添加一个响应拦截器
axios.interceptors.response.use(
  response => {
    NProgress.done()
    if (response.data.code === 0 || 1018) {
      // tryHideFullScreenLoading();
      return response
    } else {
      Message.error('操作错误!请联系管理员')
    }
    //响应超时
    if (response.data.code == -1) {
      router.replace({
        path: '/',
        query: {
          redirect: router.currentRoute.fullPath
        } //从哪个页面跳转
      })
      return false
    }
  },
  error => {
    NProgress.done()
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Message.error('响应超时,请联系管理员')
    }
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, config).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}
