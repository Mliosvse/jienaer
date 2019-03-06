import axios from 'axios'
import { Toast } from 'vant'
import router from '@/router'
import { RES_CODE } from '@/config/portCode'
axios.defaults.timeout = 300000

// 添加请求拦截器
axios.interceptors.request.use(config => {
  let headParams = JSON.parse(localStorage.getItem('headParams') || null)
  let ContentTypeArr = ['multipart/form-data']
  if (!ContentTypeArr.includes(config.headers['Content-Type'])) { // 不是form-data类型才添加公共参数
    if (config.method === 'post') { // post请求
      config.data = Object.assign({}, headParams, config.data)
    } else { // get请求
      config.params = Object.assign({}, headParams, config.params)
    }
  }
  return config
}, err => {
  Toast('请求超时~')
  return Promise.resolve(err)
})

// 添加响应拦截器
axios.interceptors.response.use(res => {
  if (res.status && res.status === 200 && res.data.status === 'error') {
    return
  }
  return res.data
}, err => {
  if (err.response.status === 504 || err.response.status === 404) {
    Toast('服务器正在外太空遨游，请稍后再试~')
  } else if (err.response.status === 403) {
    Toast('权限不足，请联系管理员~')
  } else {
    Toast('请求失败，请稍后重试~')
  }
  return Promise.resolve(err)
})

// 拦截code码
export const interceptResCode = (res, resolve) => {
  if (res.code === '201900') { // 系统维护中
    router.push({
      path: '/home/systemrepair'
    })
  } else { // 正常抛出
    let resCode = Object.values(RES_CODE)
    if (resCode.find(item => item.includes(res.code) === true)) {
      Object.entries(RES_CODE).forEach(item => {
        if (item[1].includes(res.code)) {
          res.code = item[0]
        }
      })
    }
    resolve(res)
  }
}

// post请求
export const postRequest = (url, params) => {
  return new Promise((resolve) => {
    axios({
      method: 'post',
      url: url,
      data: params,
      headers: {
        id: 'H5',
        userName: localStorage.getItem('userName'),
        accessToken: localStorage.getItem('tokenId'),
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }).then(res => {
      interceptResCode(res, resolve)
    })
  })
}

// 人脸识别上传post
export const facePostRequest = (url, params) => {
  return new Promise(resolve => {
    axios({
      method: 'post',
      url: url,
      data: params,
      transformRequest: [ (data) => {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      interceptResCode(res, resolve)
    })
  })
}

// get请求
export const getRequest = (url, params) => {
  return new Promise(resolve => {
    axios({
      method: 'get',
      url: url,
      params: params,
      headers: {
        tokenId: localStorage.getItem('tokenId')
      }
    }).then(res => {
      interceptResCode(res, resolve)
    })
  })
}

// 文件上传
export const uploadFileRequest = (url, params) => {
  return new Promise(resolve => {
    axios({
      method: 'post',
      url: url,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      interceptResCode(res, resolve)
    })
  })
}
