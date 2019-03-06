/**
 * RES_CODE
 * @type {Readonly<{SUCCESS: string}>}
 */
export const RES_CODE = Object.freeze({
  SUCCESS: '200, 1000', // 接口成功
  WEAKRISKFAIL: '620001,630002', // 弱风控被拒
  MUTEX: '201901', // 互斥
  OVERDUE: '201002' // 逾期
})
