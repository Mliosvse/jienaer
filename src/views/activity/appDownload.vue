<template>
    <div class="container">
        <img class="logo" src="../../assets/img/logo.png" alt="">
        <div @click="goDownload" class="btn">Android客户端下载</div>
        <!--<a href="https://a.app.qq.com/o/simple.jsp?pkgname=com.hzjs.wjs#opened" class="btn">Android客户端下载</a>-->
        <div class="btn" @click="iosDownLoad">iPhone客户端下载 </div>
        <div class="btn" @click="openApp">已安装App 立即打开 </div>
        <div class="alert_fixed" v-show="alert">
            <img src="https://f.weijinshi.com/myoss/data/486B80900E467EE8AD779B5BB7540C29.png">
        </div>
        <div class="alert_fixed" v-if="safariAlert">
            <img src="../../assets/img/safariAlert.png">
        </div>
    </div>
</template>

<script>
    export default {
        name: "appDownload",
        data(){
            return{
                alert:false,
                safariAlert:false,
                androidLInk:'',
                iosLInk:'',
                url:this.$route.query.url
            }
        },
        created(){
            //&replace=1为自定义的url拼接参数，需要加上判断操作否则会一直刷新一直重定向
            let _href = window.location.href
            if (this.$util.is_weixin() && _href.indexOf('replace=1') === -1&&this.$util.checkPlatform()==='ios') {
                _href = _href.indexOf('?')=== -1 ? _href+'?replace=1':_href+'&replace=1';
                window.location.replace(_href);
            }
        },
        mounted(){
            if(this.$util.is_weixin()){
                if(this.$util.checkPlatform()==='ios'){
                    this.safariAlert = true;
                }else {
                    this.alert = true;
                }
            }
            this.getAndroidLink();
            this.h5apiDownload();
        },
        methods:{
            //获取Android下载链接
            getAndroidLink(){
                if(this.url) {
                    this.androidLInk = this.url;
                }else {
                    if(window.location.origin.indexOf('jnh5.zjlinxi.com')===-1){
                        this.androidLInk = 'http://jienaer.oss-cn-hangzhou.aliyuncs.com/apk/online/jienaer.apk';
                    }else {
                        this.androidLInk = 'http://jienaer.oss-cn-hangzhou.aliyuncs.com/apk/online/jienaer.apk';
                    }
                }
            },
            //h5唤起App
            openApp(){
                window.location.href = 'jienaerschema://jienaer.weijinshi.com?name=HOME';
            },
            //下载并埋点
            goDownload(){
                this.$myHttp.jsonPost('/burial/h5apiDownload',{channelCode:'download1'});
                window.location.href =this.androidLInk;
            },
            //ios下载点击
            iosDownLoad(){
                this.$myHttp.jsonPost('/burial/h5apiDownload',{channelCode:'download1'});
                this.$router.push({
                    path: '/iosDownLoad'
                })
            },
            //页面埋点
            h5apiDownload(){
                this.$myHttp.jsonPost('/burial/h5apiDownPage',{channelCode:'page1'});
            }
        }
    }
</script>

<style scoped lang="less">
    .container{
        padding-top: 180px;
        .logo{
            display: block;
            margin: 0 auto 100px;
            width: 250px;
            height: 250px;
        }
        .btn{
            background: url("../../assets/img/btn.png");
            background-size: 100%;
            display: block;
            width: 600px;
            height: 88px;
            line-height: 88px;
            box-sizing: border-box;
            margin: 0 auto 40px;
            text-align: center;
            font-size: 32px;
            color: #14abFA;
        }
    }
</style>