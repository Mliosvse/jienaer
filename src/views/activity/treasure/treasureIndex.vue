<template>
    <div class="index">
        <router-view></router-view>
        <ul class="tb">
            <li :class="active==='treasure'?'active':''" @click="goLink('treasure')">夺宝</li>
            <li :class="active==='order'?'active':''" @click="goLink('order')">订单</li>
            <li :class="active==='goldCoin'?'active':''" @click="goLink('goldCoin')">金币</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "treasureIndex",
        data(){
            return {
                active:this.$route.name
            }
        },
        beforeCreate () {
            this.$util.setPageHeight100p();
        },
        beforeDestroy () {
            this.$util.recoveryPageHeight();
        },
        watch:{
            '$route':'getPath'
        },
        methods:{
            //路由跳转
            goLink(path){
                this.active = path;
                this.$router.push({
                    path,
                    query:{}
                });
            },
            getPath(){
                this.active = this.$route.name;
            }
        },
    }
</script>

<style scoped lang="less">
.index{
    height: 100%;
    .tb{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background:#E5E7FC;
        display: flex;
        justify-content: space-between;
        li{
            flex: 1;
            line-height: 98px;
            text-align: center;
            font-size: 36px;
            color: #736FE5;
        }
        li.active{
            background: #7470E5;
            color: #ffffff;
        }
    }
}
</style>