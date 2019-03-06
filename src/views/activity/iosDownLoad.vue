<template>
    <div class="load">
        <img class="bg" src="../../assets/img/download/iosdownlaodBg.png"/>
        <ul>
            <li v-if="firStep" @click="handleLoad"><img src="../../assets/img/download/firStep.png"></li>
            <li v-if="secStep"><img src="../../assets/img/download/secStep.png"></li>
            <li v-if="thirdStep" @click="toSetUp"><img src="../../assets/img/download/tirStep.png"></li>
        </ul>
        <div class="alert_fixed" v-if="safariAlert">
            <img src="../../assets/img/safariAlert.png">
        </div>
    </div>
</template>
<script>
    export default {
        name: 'iosDownLoad',
        data() {
            return {
                safariAlert: false,
                firStep: true,
                secStep: false,
                thirdStep: false,
                url: process.env.VUE_APP_IOS_DOWNLOAD_URL, // ios下载链接
                setUpUrl: 'https://h.sinaif.com/html/activity/dawang/mobileprovision/embedded.mobileprovision', // ios通用设置
            }
        },
        created() {
            this.getPackageInfo()
        },
        mounted() {
            const isSafari = !(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)&&!/CriOS/.test(navigator.userAgent)&&!/Browser/.test(navigator.userAgent));
            if(isSafari){
                this.safariAlert = true;
            }
        },
        methods: {
            // ios下载
            handleLoad() {
                window.location = "itms-services://?action=download-manifest&url=" + this.url
                this.loadStep()
            },
            toSetUp() { // 调起ios通用设置
                window.location.href = this.setUpUrl
            },
            // 下载步骤按钮
            loadStep() {
                if (this.firStep) {
                    this.firStep = false
                    this.secStep = true
                    setTimeout(() => {
                        this.secStep = false
                        this.thirdStep = true
                        return false
                    }, 5000)
                }
            },
            //获取iOS下载链接
            getPackageInfo() {
                this.$myHttp.jsonPost('/packageApp/queryChannelPackageInfo', {channelCode: 'iOSEnterprise'}).then(res => {
                    if (res.result.code === '1000') {
                        let resData = res.result.data;
                        if (resData) {
                            this.url = resData.appUrl;
                        }
                    }
                });
            },
        }
    }
</script>
<style lang="less" scoped>
    .load {
        .bg {
            width: 100%;
        }

        ul {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            margin: auto;
            width: 698px;

            img {
                width: 100%;
            }
        }
    }
</style>
