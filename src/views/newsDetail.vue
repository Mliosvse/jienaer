<template>
    <div class="container">
        <div class="txt_box">
            <h2 class="title">{{dataObj.title}}</h2>
            <p class="des">来源：<span>{{dataObj.resource}}</span>{{dataObj.time}}</p>
            <div class="txt" v-html="dataObj.content"></div>
            <div class="source"> {{dataObj.copyright}}</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'newsdetail',
        components:{},
        data() {
            return {
                desc: '',
                id:this.$route.query.id,
                appInfo:this.$util.isApp(),
                dataObj: {}
            }
        },
        mounted() {
            this.getDetails();
            //分享H5方法，客户端调用
            window.nativeGetShareData =  this.handleShare();
        },
        methods: {
            getDetails() {
                let postData = {
                    id: this.id,
                    environment: "sdafa"
                }
                this.$myHttp.jsonPost('/info/infoDetail',postData,1).then((res) => {
                    if(res.result.code==="1000"){
                        this.dataObj = res.result.data;
                        let desc = this.dataObj.content.replace(/<(?!img).*?>/g, "");
                        this.desc = desc.replace(/<img[^<>]+>/g,'');
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                })
            },
            handleShare () {
                let newsShareObj = {
                    'title': this.dataObj.title,
                    'content': this.desc.slice(0,30) + '......',
                    'iconUrl': 'http://f.weijinshi.com/myoss/data/20181126/577b4d9ac7ad4a138e6795d99f64c42d.png',
                    'shareUrl': window.location.origin+'/fxr/newsdetail?id='+this.id
                };
                let newsShareStr = JSON.stringify(newsShareObj)
                return newsShareStr
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
                margin: 10px 0;
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
