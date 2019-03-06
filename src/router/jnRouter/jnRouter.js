const jnRouter = [
    {
        path: '/infoDetails',
        name: 'infoDetails',
        meta: {
            title: "资讯详情"
        },
        component: () => import('@/views/infoDetails.vue')
    }, {
        path: '/newsdetail',
        name: 'newsdetail',
        meta: {
            title: "资讯详情"
        },
        component: () => import('@/views/newsDetail.vue')
    }, {
        path: '/userauthptl',
        name: 'userauthptl',
        meta: {
            title: "用户授权协议"
        },
        component: () => import('@/views/agreement/userAuthPtl.vue')
    }, {
        path: '/registerAgreement',
        name: 'registerAgreement',
        meta: {
            title: "注册协议"
        },
        component: () => import('@/views/agreement/registerAgreement.vue')
    }, {
        path: '/userPrivacyAgreement',
        name: 'userPrivacyAgreement',
        meta: {
            title: "用户隐私协议"
        },
        component: () => import('@/views/agreement/userPrivacyAgreement.vue')
    }, {
        path: '/channelRegister',
        name: 'channelRegister',
        meta: {
            title: "借哪儿--3分钟极速下款"
        },
        component: () => import('@/views/activity/channelRegister.vue')
    }, {
        path: '/appDownload',
        name: 'appDownload',
        meta: {
            title: "借哪儿--3分钟极速下款"
        },
        component: () => import('@/views/activity/appDownload.vue')
    }, {
        path: '/iosDownLoad',
        name: 'iosDownLoad',
        meta: {
            title: "借哪儿--3分钟极速下款"
        },
        component: () => import('@/views/activity/iosDownLoad.vue')
    }, {
        path: '/creditCard',
        name: 'creditCard',
        meta: {
            title: "信用卡"
        },
        component: () => import('@/views/creditCard/creditCard.vue')
    }, {
        path: '/competitiveCreditCard',
        name: 'competitiveCreditCard',
        meta: {
            title: "精选信用卡"
        },
        component: () => import('@/views/creditCard/competitiveCreditCard.vue')
    }, {
        path: '/creditCardInformation',
        name: 'creditCardInformation',
        meta: {
            title: "信用卡资讯"
        },
        component: () => import('@/views/creditCard/creditCardInformation.vue')
    }, {
        path: '/creditInfoDetails',
        name: 'creditInfoDetails',
        meta: {
            title: "信用卡资讯详情"
        },
        component: () => import('@/views/creditCard/creditInfoDetails.vue')
    },{
        path: '/selectPlatform',
        name: 'selectPlatform',
        meta: {
            title: "选择平台"
        },
        component: () => import('@/views/bill/selectPlatform.vue')
    },{
        path: '/bill',
        name: 'bill',
        meta: {
            title: "我的账本"
        },
        component: () => import('@/views/bill/bill.vue')
    },{
        path: '/addBillSingle',
        name: 'addBillSingle',
        meta: {
            title: "记一笔"
        },
        component: () => import('@/views/bill/addBillSingle.vue')
    },{
        path: '/addBillMany',
        name: 'addBillMany',
        meta: {
            title: "记一笔"
        },
        component: () => import('@/views/bill/addBillMany.vue')
    },{
        path: '/editBill',
        name: 'editBill',
        meta: {
            title: "编辑账单"
        },
        component: () => import('@/views/bill/editBill.vue')
    }, {
        path: '/creditSearch',
        name: 'creditSearch',
        meta: {
            title: "上征信吗"
        },
        component: () => import('@/views/upCredit/creditSearch.vue')
    }, {
        path: '/creditResult',
        name: 'creditResult',
        meta: {
            title: "上征信吗"
        },
        component: () => import('@/views/upCredit/creditResult.vue')
    }]
export default jnRouter;