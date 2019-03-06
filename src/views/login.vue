<template>
    <div class="login">
        <div class="item">
            <p>手机号</p>
            <input v-model="mobile" type="text" placeholder="请填写手机号">
            <!--<span class="errMsg">{{errMobile}}</span>-->
        </div>
        <div class="item">
            <p>验证码</p>
            <input v-model="msgCode" type="text" placeholder="请填写验证码">
            <span class="errMsg">{{errCode}}</span>
            <div class="code" v-show="!reget" @click="getMsgCode">点击获取验证码</div>
            <div class="code" v-show="reget">重新获取 ({{countDown}}s)</div>
        </div>
        <div class="btn" @click="btnClick">登录</div>
        <div class="txt">
            <p>未注册用户将直接为您注册 </p>
            <p>点击登录即代表同意
                <router-link :to="{ name: 'registerAgreement'}">《注册协议》</router-link>
            </p>
        </div>
    </div>
</template>
<style scoped lang="less">
    .login {
        background: #14ABFA;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        box-sizing: border-box;
        padding: 128px 64px;
        height: 100%;
    }
    .item {
        margin-bottom: 64px;
        border-bottom: 0.5px solid #fff;
        position: relative;
        .code {
            color: #FFFF66;
            font-size: 28px;
            position: absolute;
            top: 82px;
            right: 0;
        }
        p {
            color: #fff;
            font-size: 28px;
            margin-bottom: 48px;
        }
        input {
            height: 36px;
            line-height: 32px;
            margin-bottom: 32px;
            font-size: 32px;
            /*caret-color:#fff;*/
            color: #fff;
        }
        input::placeholder {
            color: rgba(255, 255, 255, 0.6);
            font-size: 28px;
        }
        .errMsg{
            position: absolute;
            bottom: -38px;
            left: 0;
            color: red;
            line-height: 28px;
            font-size: 28px;
        }
    }
    .btn {
        margin-top: 80px;
        width: 622px;
        line-height: 88px;
        background: #14E3FA;
        border-radius: 46px;
        text-align: center;
        color: #fff;
        font-size: 32px;
    }
    .txt {
        color: rgba(255, 255, 255, 0.8);
        margin: 32px auto;
        p {
            text-align: center;
            font-size: 24px;
            line-height: 36px;
            a {
                color: #fff;
            }
        }
    }
</style>
<script>
    export default {
        name: 'home',
        data() {
            return {
                mobile: '',
                msgCode: '',
                countDown: 60,
                reget: false,
                errCode: '',
                timer: null
            }
        },
        mounted() {

        },
        methods: {
            btnClick() {
                if(!this.validateFrom()){
                    return
                }
                let postData = {
                    mobile:this.mobile,
                    code:this.msgCode,
                    registerSource:1,
                    source:this.$route.query.source,
                }
                this.$myHttp.post('/api/login/memberLogin',postData).then((res)=>{
                    if(res.code===1){
                        window.localStorage.accessToken = res.data.accessToken;
                        const url = this.$route.query.url;
                        window.location.href = url;
                    }else {
                        this.errCode = res.msg;
                    }
                });
            },
            getMsgCode() {
                if(!this.validateMobile()){
                    return
                }
                let postData = {
                    mobile:this.mobile
                }
                this.reget = true;
                let that = this;
                this.timer = setInterval(function () {
                    that.countDown--;
                    if (that.countDown == 0) {
                        that.reget = false;
                        clearInterval(that.timer);
                        that.timer = null;
                        that.countDown = 60;
                    }
                }, 1000);
                this.$myHttp.post('/api/login/sendLoginSms',postData).then((res)=>{
                    if(res.code===1){
                        this.$util.Toast({message:'发送成功'});
                    }else {
                        this.$util.Toast({message:res.msg});
                    }
                });
            },
            validateMobile(){
                if(this.mobile.length!==11){
                    this.errCode = '请正确输入手机号码';
                    return false;
                }
                this.errCode = '';
                return true;
            },
            validateFrom(){
                if(!this.validateMobile()||this.msgCode.length!==6){
                    this.errCode = '请正确输入验证码'
                    return false;
                }
                this.errCode = ''
                return true;
            }
        }
    }
</script>