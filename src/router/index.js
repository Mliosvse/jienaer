import Vue from 'vue'
import Router from 'vue-router'
import smallLoanRouter from '@/router/smallLoanRouter/smallLoanRouter'
import jnRouter from '@/router/jnRouter/jnRouter'
import activityRouter from '@/router/activity/activityRouter'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        ...smallLoanRouter,
        ...jnRouter,
        ...activityRouter
    ]
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

export default router