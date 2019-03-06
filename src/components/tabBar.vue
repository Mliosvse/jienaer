<template>
    <div class="container">
        <div class="list" @click="goLink('loanMarket')">
            <img v-show="!(active==='loanMarket')" src="../assets/img/icon_money.png" alt="">
            <img v-show="active==='loanMarket'" src="../assets/img/active_moeny.png" alt="">
            <p :class="active==='loanMarket'?'active':''">借钱</p>
        </div>
        <div class="list" @click="goLink('strategy')">
            <img v-show="!(active==='strategy')" src="../assets/img/gift.png" alt="">
            <img v-show="active==='strategy'" src="../assets/img/active_gift.png" alt="">
            <p :class="active==='strategy'?'active':''">福利</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tabBar",
        data(){
            return{
                active:this.$route.name
            }
        },
        mounted(){

        },
        methods:{
            goLink(path){
                this.$router.push(path);
            },
            getPath(){
                this.active = this.$route.name;
            }
        },
        watch:{
            '$route':'getPath'
        }
    }
</script>

<style scoped lang="less">
.container{
    width: 100%;
    position: fixed;
    z-index: 12;
    bottom: 0;
    left: 0;
    background: #fff;
    display: flex;
    justify-content: space-between;
    .list{
        width: 50%;
        text-align: center;
        height: 98px;
        img{
            display: block;
            width: 48px;
            height: 48px;
            margin: 10px auto 0;
        }
        p{
            height: 20px;
            font-size: 20px;
            color: #999;
        }
        .active{
            color: #14ABFA;
        }
    }
}
</style>