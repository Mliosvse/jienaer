<template>
  <div class="forgetpwd">
    <div class="step-one" v-if="step === 1">
      <div class="code box-sizing">
        <p class="code-text">请点击获取短信验证码</p>
      </div>
      <div class="code-msg">
        <input class="code-text"  pattern="[0-9]*" maxlength="6" v-model="verifyCode" placeholder="请输入验证码"/>
        <p class="msg-text" v-if="showCode" @click="getSendCode">发送短信验证码</p>
        <p class="msg-text" v-else>剩余{{ second }}秒</p>
      </div>
    </div>
    <div class="step-two" v-else-if="step === 2">
      <p class="user">请填写 <span class="user-name">{{ name }}</span> 的身份证号码验证身份 </p>
      <input class="user-text" type="text" v-model="idCard" placeholder="请输入身份证号码" maxlength="18"/>
    </div>

    <jn-button v-if="step===1||step===2" class="btn" :click="handleNext">下一步</jn-button>

    <div class="step-three" v-if="step === 3">
      <!-- 密码输入框 -->
      <van-password-input
        :value="newPwd"
        info="请输入新的支付密码"
        @focus="showKeyboard = true">
      </van-password-input>
      <!-- 数字键盘 -->
      <van-number-keyboard
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false">
      </van-number-keyboard>
      <jn-button class="btn-ok" :click="fComplete">完成</jn-button>
    </div>

    <div class="loading-mask" v-if="showLoding" >
      <van-loading type="spinner" color="black" class="spinner-loading" />
    </div>
  </div>
</template>

<script>
import {apiSendSms, apiValidateSmsCode, apiValidateIdNumber} from '@/api/borrow'
export default {
  props: {
    step: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      showLoding: false,
      phone: '',
      second: '',//60秒
      verifyCode: '',//验证码
      idCard: '',//身份证号
      newPwd: '',//新密码
      showCode: true,//倒计时和发送短信验证码
      verifyStatus: 0,//判断是否发送过短信
      name: '',
      showKeyboard: true,
      routerFrom: '',
      billIds: [],
      amount: '',
      couponId: '',
      repaymentAmount: '',
      checkSum: ''
    }
  },
  mounted() {
    this.name = localStorage.getItem('realName') || ''
    this.phone = localStorage.getItem('userName') || ''
  },
  methods: {
    getSendCode() {
      this.showLoding = true;
      apiSendSms({}).then(res=>{
        this.$toast('已发送验证码至'+this.phone)
        if (res.code === 'SUCCESS') {
          this.second = 60;
          this.verifyStatus = 1;
          let t = setInterval(()=>{
            this.second--
            if(this.second === 0) {
              clearInterval(t);
              t = null 
              this.showCode = true;
            }
          },1000)
          this.showCode = false;
        }else{
          this.$toast(res.msg)
        }
        this.showLoding = false;
      })
    },
    handleNext () {
      if (this.step === 1) {
        if (this.verifyStatus === 0) {
          this.$toast('请发获取短信验证码')
          return false
        }
        if (this.verifyCode === '') {
          this.$toast('请输入验证码')
          return false
        }
        let params = {code: this.verifyCode}
        apiValidateSmsCode(params).then(res=>{
          if(res.code==='SUCCESS'){
            this.step++
          } else {
            this.toast(res.msg)
          }
        })
      } else if(this.step === 2) {
        if(this.idCard == '') {
          this.$toast('请输入身份证号码')
          return false
        }
        let params = {idNumber: this.idCard}
        apiValidateIdNumber(params).then(res=>{
          if(res.code==='SUCCESS'){
            if(res.data.status === 1) {
              this.step++
            } else {
              this.$toast('身份证号错误')
            }
          } else {
            this.$toast(res.msg)
          }
        })
      }
    },
    onInput(key) {
      this.newPwd = (this.newPwd + key).slice(0, 6);
    },
    onDelete() {
      this.newPwd = this.newPwd.slice(0, this.newPwd.length - 1);
    },
    fComplete () {
      if(this.newPwd == '') {
        this.$toast('请输入新的支付密码')
      }else if(this.newPwd.length === 6) {
        this.$emit('setNewPwdComplete', this.newPwd)
      }else {
        this.$toast('请输入新的支付密码')
      }
    }
  }
}
</script>

<style lang="less">
  .forgetpwd {
    .btn {
      margin: 0.82rem auto 0;
    }
    .step-one {
      .code {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding: 0.72rem 0 0 0.24rem;
        .code-text {
          font-size: 32px;
          color: #666666;
          .phone {
            font-size: 36px;
            color: #000000;
          }
        }
      }
      .code-msg {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 0.78rem 0.24rem 0 0.24rem;
        padding-bottom: 0.2rem;
        border-bottom: 1px solid #E6E6E6;
        .code-text {
          font-size: 28px;
        }
        .msg-text {
          font-size: 28px;
          color: #2BADF0;
        }
      }
    }
    .step-two {
      .user {
        font-size: 32px;
        color: #666666;
        margin: 0.7rem 0.24rem 0 0.24rem;
        .user-name {
          color: #000;
        }
      }
      .user-text {
        border-bottom: 1px solid #E6E6E6;
        padding: 0.8rem 0 0.2rem 0;
        font-size: 28px;
        color: #999999;
        width: 7rem;
        margin-left: 0.24rem;
      }
    }
    .step-three {
      padding-top: 1.2rem;
      .btn-ok {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%);
        // margin-top: 220px;
      }
    }
    .loading-mask {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2010;
      .van-loading--spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
