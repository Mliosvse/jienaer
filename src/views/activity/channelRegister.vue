<template>
    <div class="container">
        <div class="content">
            <div class="item">
                <input v-model="mobile" pattern="[0-9]*" maxlength="11" type="text" placeholder="请填写手机号">
            </div>
            <div class="item">
                <input v-model="msgCode" pattern="[0-9]*" maxlength="6" type="text" placeholder="请填写验证码">
                <!--<span class="errMsg">{{errCode}}</span>-->
                <div class="code" v-show="!reget" @click="channelcheckUser">点击获取验证码</div>
                <div class="code" style="color: #999999" v-show="reget">重新获取 ({{countDown}}s)</div>
            </div>
            <div class="btn" @click="btnClick">立即借钱</div>
        </div>
        <div class="footer">
            <p>浙江霖梓科技有限公司</p>
            <p>浙江省杭州市滨江区长河街道滨盛路1776号2008室</p>
            <p>联系电话: 4008-609-611</p>
        </div>
        <div v-if="overdue" class="overdue">
            <p>该链接已失效</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "channelRegister",
        data() {
            return {
                // baseUrl: process.env.BASE_URL,
                overdue: false,
                mobile: '',
                msgCode: '',
                countDown: 60,
                reget: false,
                isPending: true,
                errCode: '',
                isGolinking: false,  //是否真正跳转页面
                timer: null,
                channelCode:this.$route.query.channelCode,
                style:this.$route.query.style,
            }
        },
        beforeCreate () {
            document.querySelector('html').style.background='#0574AE';
        },
        beforeDestroy () {
            document.querySelector('html').style.background='';
        },
        mounted() {
            this.countChannle();
        },
        methods: {
            //点击注册
            btnClick() {
                if(!this.validateFrom()&&this.isPending){
                    return
                }
                let postData = {
                    userName:this.mobile,
                    smsCode:this.msgCode,
                    channelCode:this.channelCode,
                    style:this.style
                }
                this.$myHttp.formPost('/user/channel/register',postData).then((res)=>{
                    this.isPending = true;
                    if(res.result.code==="1000"){
                        this.$router.push({
                            path: '/appDownload',
                            query: {
                                url: res.result.data.url
                            }
                        });
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                });
            },
            //校验用户是否注册
            channelcheckUser(){
                if(!this.validateMobile()||this.isGolinking){
                    return
                }
                let postData = {
                    userName:this.mobile,
                    channelCode:this.channelCode,
                    style:this.style,
                }
              this.$myHttp.formPost('/user/channel/checkUser',postData).then(res=>{
                  if(res.result.code==='1000'){
                      this.getMsgCode();
                  }else if(res.result.code==='1007'){
                      this.isGolinking = true;
                      setTimeout(()=>{
                          this.$router.push({
                              path: '/appDownload',
                          });
                      },1500);
                      this.$util.Toast({message:'该号码已经注册'});
                  }else {
                      this.$util.Toast({message:res.result.msg});
                  }
              })
            },
            //获取验证码
            getMsgCode() {
                let postData = {
                    mobile:this.mobile,
                    sendType:0,
                    devType:'H5',
                    blackBox:localStorage.blackBox,
                    channelCode:this.channelCode,
                }
                this.reget = true;
                let that = this;
                this.timer = setInterval(function () {
                    that.countDown--;
                    if (that.countDown === 0) {
                        that.reget = false;
                        clearInterval(that.timer);
                        that.timer = null;
                        that.countDown = 60;
                    }
                }, 1000);
                this.$myHttp.jsonPost('/user/sendSmsCode',postData).then((res)=>{
                    if(res.result.code==="1000"){
                        this.$util.Toast({message:'发送成功'});
                    }else {
                        this.$util.Toast({message:res.result.msg});
                        this.reget = false;
                        clearInterval(this.timer);
                        this.timer = null;
                        this.countDown = 60;
                    }
                });
            },
            //先验证渠道是否有效后统计渠道访问量
            countChannle(){
                let postData = {
                    channelCode:this.channelCode,
                    style:this.style,
                }
                this.$myHttp.formPost('/user/channel/checkChannel ',postData).then((res)=>{
                    if(res.result.code==='1000'){
                        this.$myHttp.formPost('/user/channel/stat', postData);
                    }else {
                        this.overdue = true;
                    }
                });
            },
            //校验手机号
            validateMobile(){
                if(this.mobile.length===11&&(/^1(3|4|5|6|7|8|9)\d{9}$/i.test(this.mobile))){
                    return true;
                }else {
                    this.$util.Toast({message: '请正确输入手机号码'});
                    return false;
                }
            },
            //校验验证码
            validateFrom(){
                if(this.validateMobile()){
                    if(this.msgCode.length!==6){
                        this.$util.Toast({message: '请正确输入验证码'});
                        return false;
                    }else {
                        return true;
                    }
                }else {
                    return false;
                }
            }
        }
    }
</script>

<style scoped lang="less">
.container{
    background:#0574AE url("../../assets/img/acRegister_bg2.png") no-repeat;
    background-size: 100% auto;
    padding-top: 404px;
    padding-bottom: 40px;
    box-sizing: border-box;
    min-height: 100%;
    .content{
        position: relative;
        background:url("../../assets/img/acRegister_bg1.png") no-repeat;
        background-size: 100%;
        width: 686px;
        height: 810px;
        margin: 0 auto 40px;
        padding-top: 438px;
        box-sizing: border-box;
        .item {
            width: 526px;
            margin: 0 auto 32px;
            border-bottom: 0.5px solid #DDDDDD;
            position: relative;
            .code {
                color: #14ABFA;
                font-size: 28px;
                position: absolute;
                top: 0px;
                right: 0;
            }
            input {
                height: 36px;
                line-height: 32px;
                margin-bottom: 32px;
                font-size: 32px;
                color: #666;
            }
            input::placeholder {
                color: #DDDDDD;
                font-size: 28px;
            }
            .errMsg{
                position: absolute;
                bottom: -34px;
                left: 0;
                color: red;
                line-height: 28px;
                font-size: 28px;
            }
        }
        .btn {
            margin: 48px auto 0px;
            width: 526px;
            line-height: 88px;
            background: #14ABFA;
            font-weight: bold;
            border-radius: 46px;
            text-align: center;
            color: #fff;
            font-size: 32px;
        }
    }
    .footer{
        text-align: center;
        color: #ffffff;
    }
    .overdue{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background: #ffffff;
        p{
            font-size: 32px;
            text-align: center;
            margin:560px auto 0;
        }
    }
}
</style>