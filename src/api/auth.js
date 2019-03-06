import { postRequest } from '@/config/network'

// 资料认证列表
export const apiQueryUserAuthStatus = (params) => {
  return postRequest('/userAuth/queryUserAuthStatus', params)
}

// 运营商认证
export const apiAuthMobile = (params) => {
  return postRequest('/userAuth/authMobile', params)
}
// 运营商认证回调
export const apiBackMobile = (params) => {
  return postRequest('/userAuth/backMobile', params)
}

