<template>
    <div class="item" @click="goDetails">
        <div class="content">
            <p class="title">[{{item.platForm}}] {{item.title}}</p>
            <p class="txt">平台: <span>{{item.platForm}}</span> {{this.$util.formatDateTime(item.addTime,false)}}</p>
        </div>
        <!--<img :src="item.imageUrl" alt="">-->
        <div class="banner" :style="`background-image: url('${item.imageUrl}')`"></div>

    </div>
</template>

<script>
    export default {
        name: "secretItem",
        data() {
            return {
                baseUrl:process.env.BASE_URL
            }
        },
        props: {
            item: Object,
        },
        methods: {
            //跳转详情页面
            goDetails() {
                let url = window.location.origin+this.baseUrl+'secretDetails?id='+this.item.id;
                //自定义跳转页面
                this.$util.customGoLink(url);

            }
        }
    }
</script>

<style scoped lang="less">
    .item {
        background: #ffffff;
        overflow: hidden;
        padding: 48px 32px 32px;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        .banner{
            float: right;
            width: 200px;
            height: 128px;
            background-size: 100% auto;
            background-position: center;
        }
        .content{
            float: left;
            width: calc(100% - 232px);
            .title{
                margin-bottom: 16px;
                font-size: 28px;
                min-height: 70px;
                font-weight:400;
                color: #333;
                overflow: hidden;
                -webkit-box-orient: vertical;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
            }
            .txt{
                font-size:24px;
                line-height: 36px;
                font-weight:400;
                color: #999999;
                span{
                    color: #14ABFA;
                    margin-left: 12px;
                    margin-right: 32px;
                }
            }
        }
    }
</style>