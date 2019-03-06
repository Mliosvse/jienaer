export default [
    {
        path: '/propaganda',
        name: 'propaganda',
        meta: {title: "借哪儿-下款快，贷款种类多"},
        component: () => import('../../views/activity/propaganda.vue')
    }, {
        path: '/treasureIndex',
        name: 'treasureIndex',
        meta: {title: "幸运夺宝"},
        component: () => import('../../views/activity/treasure/treasureIndex.vue'),
        children: [
            {
                path: '/treasure',
                name: 'treasure',
                meta: {title: "幸运夺宝"},
                component: () => import('../../views/activity/treasure/treasure.vue')
            }, {
                path: '/order',
                name: 'order',
                meta: {title: "夺宝订单"},
                component: () => import('../../views/activity/treasure/order.vue')
            }, {
                path: '/goldCoin',
                name: 'goldCoin',
                meta: {title: "金币"},
                component: () => import('../../views/activity/treasure/goldCoin.vue')
            },
        ]
    }, {
        path: '/treasureDetails',
        name: 'treasureDetails',
        meta: {title: "夺宝详情"},
        component: () => import('../../views/activity/treasure/treasureDetails.vue')
    }, {
        path: '/orderDetails',
        name: 'orderDetails',
        meta: {title: "订单详情"},
        component: () => import('../../views/activity/treasure/orderDetails.vue')

    }, {
        path: '/bettingResult',
        name: 'bettingResult',
        meta: {title: "投注成功"},
        component: () => import('../../views/activity/treasure/bettingResult.vue')
    }, {
        path: '/guide',
        name: 'guide',
        meta: {title: "指南"},
        component: () => import('../../views/activity/treasure/guide.vue')
    }, {
        path: '/ashore',
        name: 'ashore',
        meta: {title: "帮你还款,助你上岸"},
        component: () => import('../../views/activity/ashore.vue')
    }

]