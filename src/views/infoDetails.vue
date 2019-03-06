<template>
    <div class="container">
        <div class="txt_box">
            <h2 class="title">{{dataObj.title}}</h2>
            <p class="des">来源：<span>{{dataObj.resource}}</span>{{dataObj.time}}</p>
            <div class="txt" v-html="dataObj.content"></div>
            <div v-if="dataObj.isOriginal == 1" class="source">【独家稿件及免责声明】该文为我司原创文章，任何媒体或个人全部或部分转载，请注明出处（借哪儿）。文章中所载的信息及结论只提供用户作参考，不构成投资建议。</div>
            <div v-else class="source">【版权声明】本文为网络转载文章，若有权属异议请联系我们删稿，联系邮箱：contact@linziwl.com</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'infoDetails',
        data() {
            return {
                infosUp: '',
                infosNext: '',
                id:this.$route.query.id,
                appInfo:this.$util.isApp(),
                dataObj: {}
            }
        },
        mounted() {
            this.getDetails();
        },
        methods: {
            getDetails() {
                let postData = {
                    infoId: this.id,
                    userName: this.appInfo.userName
                }
                this.$myHttp.jsonPost('/infoManMade/infoDetail',postData,1).then((res) => {
                    if(res.result.code==="1000"){
                        this.dataObj = res.result.data;
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .container {
        .txt_box {
            background: #fff;
            padding: 64px 32px 48px;
            .source {
                font-size: 28px;
                color: #BEC2CC;
                letter-spacing: 0;
                text-align: justify;
            }
            .title {
                color: #333;
                font-size: 36px;
                margin-bottom: 48px;
                font-weight: normal;
            }
            .des {
                font-size: 28px;
                color: #999999;
                span {
                    color: #14ABFA;
                    margin: 0 48px 0 5px;
                }
            }
            .txt {
                width:100%;
                overflow:hidden;
                margin-top: 32px;
                margin-bottom: 64px;
            }
            .other {
                display: flex;
                justify-content: space-between;
                color: #14ABFA;
                font-size: 28px;
            }
        }
        .ad {
            width: 100%;
            padding: 60px 0px;
            img{
                display: block;
                width: 686px;
                height: 240px;
                margin: 0px auto;
            }
        }
    }
</style>
