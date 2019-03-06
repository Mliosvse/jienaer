<template>
    <div id="app">
        <router-view/>
        <!--<tab-bar v-if="showTab"></tab-bar>-->
        <!--<div class="safari_d1_alert" v-if="safariAlert">-->
            <!--<img @click="safariAlert=false" src="./assets/img/safariShare.png" alt="">-->
        <!--</div>-->
        <loading v-show="shadeLoading"></loading>
    </div>
</template>
<script>
    import Loading from './components/loading'
    // import TabBar from './components/tabBar'
    import { mapState } from 'vuex'
    export default {
        components: {Loading},
        computed:{
            ...mapState(['shadeLoading'])
        },
        data(){
            return{
                baseUrl: process.env.BASE_URL,
                // showTab:false,
                // safariAlert:false,
            }
        },
        methods:{
            // getIsWeb(){
            //     const pathname = window.location.pathname;
            //     const search = window.location.search;
            //     const showArr = [`${this.baseUrl}loanMarket`,`${this.baseUrl}strategy`];
            //     this.showTab = search.indexOf('_appInfo')=== -1 && showArr.indexOf(pathname)!== -1;
            // },
            nativeClearLocalStorage () {
                localStorage.setItem('orderNo', null)
            },
            handleAppInfo() {
                console.log('App.vue 第一次进入',window.location.href);
                if (!this.$getUrlPara('_appInfo')) return
                const appInfo = JSON.parse(this.$getUrlPara('_appInfo'))
                localStorage.setItem('appInfo', JSON.stringify(appInfo))
                localStorage.setItem('userName', appInfo.userName)
            }
        },
        mounted(){
            window.nativeClearLocalStorage = this.nativeClearLocalStorage
            // this.getIsWeb();
            // 获取appinfo
            this.handleAppInfo()
            // if(this.$util.GetQueryString('browser')==='safari'&&!window.localStorage.safari){
            //     this.safariAlert = true;
            //     window.localStorage.safari = 'asked';
            // }
            // if(this.$util.GetQueryString('browser')==='safariClear'){
            //     window.localStorage.safari = '';
            // }
        }
    }
</script>
<style lang="less">
    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
