const smallLoanRouter = [
  {
    path: '/productDetail', name: 'productDetail',
    meta: { title: '产品详情' },
    component: () => import('@/views/smallLoan/home/productDetail')
  }, {
    path: '/auth/dataAt', name: 'dataAt',
    meta: { title: "资料认证" },
    component: () => import('@/views/smallLoan/auth/dataAt.vue')
  }, {
    path: '/auth/supplementData', name: 'supplementData',
    meta: { title: "补充资料" },
    component: () => import('@/views/smallLoan/auth/supplementData.vue')
  }, {
    path: '/auth/mobileResult', name: 'mobileResult',
    meta: { title: "运营商认证" },
    component: () => import('@/views/smallLoan/auth/mobileResult.vue')
  }, {
    path: '/bindBankCard', name: 'bindBankCard',
    meta: { title: "绑定银行卡" },
    component: () => import('@/views/smallLoan/borrow/bindBankCard.vue')
  }, {
    path: '/borrow/bankcardtype', name: 'bankcardtype',
    meta: { title: "绑定银行卡" },
    component: () => import('@/views/smallLoan/borrow/bankcardtype.vue')
  }, {
    path: '/selectBank', name: 'selectBank',
    meta: { title: "选择银行" },
    component: () => import('@/views/smallLoan/borrow/selectBank.vue')
  }, {
    path: '/orderDetail', name: 'orderDetail',
    meta: { title: '订单详情' },
    component: () => import('@/views/smallLoan/borrow/orderDetail')
  }, {
    path: '/borrow/forgetpwd', name: '/borrow/forgetpwd',
    meta: { title: '设置支付密码' },
    component: () => import('@/views/smallLoan/borrow/forgetpwd')
  }, {
    path: '/orderList', name: 'orderList',
    meta: { title: '订单列表' },
    component: () => import('@/views/smallLoan/borrow/orderList')
  }, {
    path: '/borrow/forgetpwd', name: 'forgetpwd',
    meta: { title: '设置支付密码' },
    component: () => import('@/views/smallLoan/borrow/forgetpwd')
  }, {
    path: '/signBorrow', name: 'signBorrow',
    meta: { title: '签约借款' },
    component: () => import('@/views/smallLoan/borrowcenter/signBorrow')
  }, {
    path: '/myAddress', name: 'myAddress',
    meta: { title: '我的收货地址' },
    component: () => import('@/views/smallLoan/borrowcenter/myAddress')
  }, {
    path: '/editAddress', name: 'editAddress',
    meta: { title: '添加收货地址' },
    component: () => import('@/views/smallLoan/borrowcenter/editAddress')
  }, {
    path: '/applyResult', name: 'applyResult',
    meta: { title: '申请结果' },
    component: () => import('@/views/smallLoan/borrowcenter/applyResult')
  }, {
    path: '/goodsList', name: 'goodsList',
    meta: { title: '商品列表' },
    component: () => import('@/views/smallLoan/borrowcenter/goodsList')
  }, {
    path: '/billDetail', name: 'billDetail',
    meta: { title: '账单详情' },
    component: () => import('@/views/smallLoan/repayment/billDetail')
  }, {
    path: '/repaymentDetail', name: 'repaymentDetail',
    meta: { title: '还款明细' },
    component: () => import('@/views/smallLoan/repayment/repaymentDetail')
  }, {
    path: '/repayment/forgetpwd', name: '/repayment/forgetpwd',
    meta: { title: '设置支付密码' },
    component: () => import('@/views/smallLoan/repayment/forgetpwd')
  }, {
    path: '/totalprotocol', name: 'totalprotocol',
    meta: { title: '协议' },
    component: () => import('@/views/smallLoan/protocol/totalprotocol')
  }
]

export default smallLoanRouter;