import { postRequest } from '@/config/network'

// 获取银行列表
export const apiGetFindBankList = (params) => {
  return postRequest('/api/jiena/bank/findBankList', params)
}
// 获取已绑定银行卡列表
export const apiGetUserBindBankCardList = (params) => {
  return postRequest('/api/jiena/bank/findUserBindBankCardList', params)
}
// 绑定银行卡发送验证码
export const apiSendSmsCode = (params) => {
  return postRequest('/api/jiena/bank/getSmsCode', params)
}
// 银行卡认证
export const apiCheckSmsVerification = (params) => {
  return postRequest('/api/jiena/bank/checkSmsVerification', params)
}

// 产品详情接口  获取认证列表
export const apiProductDetails = (params) => {
  return postRequest('/apiProduct/productDetails', params)
}

// 立即申请借款接口
export const apiApplyLoan = (params) => {
  return postRequest('/third/api/applyLoan', params)
}
// 补充信息认证
export const apiSubmitSupplyInfo = (params) => {
  return postRequest('/userAuth/submitSupplyInfo', params)
}

// 新增收货地址
export const apiAddAddress = (params) => {
  return postRequest('/receiving/addAddress', params)
}

// 编辑收货地址
export const apiEditAddress = (params) => {
  return postRequest('/receiving/editAddress', params)
}

// 收货地址列表
export const apiFindList = (params) => {
  return postRequest('/receiving/findList', params)
}
// 删除地址列表
export const apiDeleteArress = (params) => {
  return postRequest('/receiving/delete', params)
}

// 是否设置支付密码
export const apiValidatePassword = (params) => {
  return postRequest('/third/api/validatePassword', params)
}
// 支付密码--发送短信验证码
export const apiSendSms = (params) => {
  return postRequest('/api/jiena/payPassword/sendSms', params)
}
// 支付密码--验证短信验证码
export const apiValidateSmsCode = (params) => {
  return postRequest('/api/jiena/payPassword/validateSmsCode', params)
}
// 设置支付密码
export const apiSetPayPassword = (params) => {
  return postRequest('/api/jiena/payPassword/setPayPassword', params)
}
// 验证身份证
export const apiValidateIdNumber = (params) => {
  return postRequest('/api/jiena/payPassword/validateIdNumber', params)
}

// 撞库接口
export const apiBump = (params) => {
  return postRequest('/third/api/bump', params)
}

// 订单详情
export const apiFindOrderDetails = (params) => {
  return postRequest('/third/api/findOrderDetails', params)
}

// 用户订单列表
export const apiFindOrderList = (params) => {
  return postRequest('/third/api/findOrderList', params)
}

// 还款确认接口
export const apiPayH5Repay = (params) => {
  return postRequest('/api/jiena/repayment/payH5Repay', params)
}
// 账单详情
export const apiRepayInfo = (params) => {
  return postRequest('/api/jiena/repayment/repayInfo', params)
}
// 签约借款
export const apiSignLoan = (params) => {
  return postRequest('/third/api/signLoan', params)
}
// 借款试算
export const apiTrialAmount = (params) => {
  return postRequest('/third/api/trialAmount', params)
}
// 确认借款
export const apiConfirmLoan = (params) => {
  return postRequest('/third/api/confirmLoan', params)
}
// 确认借款
export const apiRepaymentPlan = (params) => {
  return postRequest('/third/api/repaymentPlan', params)
}
// 协议
export const apiGetContracts = (params) => {
  return postRequest('/third/api/getContracts', params)
}
// 补充协议认证文案重现
export const apiGetSupplyInfo = (params) => {
  return postRequest('/userAuth/getSupplyInfo', params)
}

// 跳转订单详情
export const apiJumpOrderDetails = (params) => {
  return postRequest('/third/api/jumpOrderDetails', params)
}

// 借款支付密码
export const apiValidatePayPassword = (params) => {
  return postRequest('/api/jiena/payPassword/validatePayPassword', params)
}

// 还款详情
export const apiGetRepaymentDetail = (params) => {
  return postRequest('/api/jiena/repayment/getRepaymentDetail', params)
}


