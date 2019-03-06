<template>
  <div class="bank-card">
    <jn-tip>该银行卡用于还款及收款，仅支持借记卡。</jn-tip>
    <van-cell-group>
      <van-cell
        :title="bankTitleObj.realNameTitle"
        :value="realName" center
        ></van-cell>
      <van-cell
        :title="bankTitleObj.idnumber"
        :value="idnumber" center
        ></van-cell>
      <van-cell
        :title="bankTitleObj.bankNameTitle" :value="bankObj.bankName" is-link center @click="handleChooseBankCard"
        ></van-cell>
      <van-field
        :label="bankTitleObj.cardNumTitle" v-model="bankObj.cardNumber" :placeholder="bankTitleObj.cardNumPd" input-align="right" center @input="handleRegNumber('cardNumber')"
      ></van-field>
      <van-field
        label="预留手机号码" v-model="bankObj.mobile" maxLength="11" placeholder="请输入银行预留手机号码" input-align="right" center @input="handleRegNumber('mobile')"
      ></van-field>
      <van-field
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
        maxlength="6"
        input-align="right"
        v-model="bankObj.verifyCode"
        @input="handleRegNumber('verifyCode')"
        @blur="handleBlur()"
      >
        <van-button v-if="!isVerifiCodeDisabled" @click="getVerifiCode" class="verify-button" :plain="true" slot="button" size="small">获取验证码</van-button>
        <van-button v-else class="verify-button" :disabled="true" :plain="true" slot="button" size="small">{{second}}s后重试</van-button>
      </van-field>
      
    </van-cell-group>

    <div class="agremt clearfix">
      <div>
        <jn-checkbox :is-check="isCheck" :handleClick="handleIsCheck"/>
        <p>我已阅读并同意</p><router-link :to="{path: '/totalprotocol', query: {type: '1'}}">《绑卡协议》</router-link>
      </div>
    </div>
    
    <jn-button v-if="handleDisable()" :click="handleSubmit">立即绑卡</jn-button>
    <jn-button v-else :disable="true">立即绑卡</jn-button>

    <van-dialog
      v-model="verifiDialogShow"
      show-cancel-button
      :before-close="handleverifiClose"
      title="绑卡验证短信已发送至"
      class="dialog-box"
    >
      <div class="dialog-tel">{{bankObj.mobile}}</div>
        <div class="dialog-input-box van-border">
          <input class="dialog-input" type="text" v-model="bankObj.verifyCode" @input="handleRegNumber('verifyCode')" placeholder="请输入验证码" maxlength="6" @blur="handleBlur()"/>
          <button v-if="!isVerifiCodeDisabled" class="btn-rese" @click="getVerifiCode">
            获取验证码
          </button>
          <button v-else class="btn-rese btn-disabled">
            {{second}}s后重新获取
          </button>
        </div>
    </van-dialog>
  </div>
</template>

<script>
import { apiSendSmsCode, apiCheckSmsVerification } from '@/api/borrow'
  export default {
    props:{
      bankTitleObj: {
        type: Object
      },
      pageType: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        bankObj: {
          cardNumber: '', // 银行卡号
          bankName: '', // 所属银行名称
          bankCode: '', // 所属银行代码
          mobile: '', // 预留手机号码
          verifyCode: '', // 短信验证
          isState: false, // 发送短信验证码状态
          bankId: '', // 银行id
          idnumber: '', //身份证号
        },
        isCheck: true,
        isVerifiCodeDisabled: false,
        verifiDialogShow: false,
        isVerifi: false,
        verifiCode: '',
        second: 60,
        realName: '', // 真实姓名
        idnumber: '', //身份证号
        bankid: '', //银行
        routerFrom: '',
        isDisabled: true
      }
    },
    mounted () {
      if (this.$route.query.queryObj) {
        this.bankObj.bankName = JSON.parse(this.$route.query.queryObj).bankName
        this.bankObj.bankCode = JSON.parse(this.$route.query.queryObj).bankCode
      }
      this.realName = localStorage.getItem('realName')
      this.idnumber = localStorage.getItem('idNumber')
      this.routerFrom = this.$route.query.routerFrom
    },
    methods: {
      handleBlur() {
        window.scrollTo(0,0);
      },
      handleDisable() {
        return this.bankObj.bankCode && this.idnumber && this.realName && this.bankObj.cardNumber && this.bankObj.mobile && this.bankObj.verifyCode
      },
      handleChooseBankCard () {
        this.$router.push({
          path: '/borrow/bankcardtype',
          query: {
            routerFrom: this.routerFrom
          }
        })
      },
      handleRegNumberBlur(val) {
        if (val==='mobile') {
          const mobileRule = /(?:^1[3456789]|^9[28])\d{9}$/
          if (!mobileRule.test(this.bankObj[val])) {
            this.$toast('手机号格式错误')
          }
        }
        if (val==='cardNumber') {
          const cardRule = /^(\d{16}|\d{19})$/
          if (!cardRule.test(this.bankObj[val])) {
            this.$toast('银行卡号格式错误')
          }
        }
      },
      handleRegNumber (val) {
        this.bankObj[val] = this.bankObj[val].replace(/[^\d]/g, '')
      },
      handleIsCheck(){
        this.isCheck = !this.isCheck
      },
      handleSubmit(){
        const mobileRule = /(?:^1[3456789]|^9[28])\d{9}$/
        const cardRule = /^(\d{16}|\d{19})$/
        if (!cardRule.test(this.bankObj['cardNumber'])) {
          this.$toast('银行卡号格式错误')
          return
        }
        if (!mobileRule.test(this.bankObj['mobile'])) {
          this.$toast('手机号格式错误')
          return
        }
        if (!this.isCheck) {
          this.$toast('请阅读并同意协议后操作');
          return
        }
        this.handleverifiClose()
        // this.verifiDialogShow = true
      },
      getVerifiCode () {
        const mobileRule = /(?:^1[3456789]|^9[28])\d{9}$/
        const cardRule = /^(\d{16}|\d{19})$/
        if (!cardRule.test(this.bankObj['cardNumber'])) {
          this.$toast('银行卡号格式错误')
          return
        }
        if (!mobileRule.test(this.bankObj['mobile'])) {
          this.$toast('手机号格式错误')
          return
        }
        if (!this.isCheck) {
          this.$toast('请阅读并同意协议后操作');
          return
        }
        this.isVerifiCodeDisabled = true
        //获取验证码
        let params = {
          "bankName": this.bankObj.bankName,
          "cardNumber": this.bankObj.cardNumber,
          "bankCode": this.bankObj.bankCode,
          "bankMobile": this.bankObj.mobile
        }
        apiSendSmsCode(params).then(res=>{
          if (res.code === 'SUCCESS') {
            this.isVerifi = true
            let timer = setInterval(()=>{
              this.second--
              if (this.second < 1) {
                clearInterval(timer)
                timer = null
                this.second = 60
                this.isVerifiCodeDisabled = false
              }
            }, 1000)
            this.bankObj.bankid = res.data.bankId || ''
          } else {
            this.bankObj.verifyCode = ''
            this.isVerifiCodeDisabled = false
            this.$toast(res.msg)
          }
        })
      },
      /**
       * action: confirm | cancel
       * done: 关闭弹框
       */
      handleverifiClose (action, done) {
        if (!this.isVerifi) {
          this.$toast('请点击获取验证码')
          done(false)
          return false
        }
        if (this.bankObj.verifyCode === '' || String(this.bankObj.verifyCode).length !== 6) {
          this.$toast('验证码格式错误')
          done(false)
          return false
        }
        let params = {
          bankId: this.bankObj.bankid,
          verifyCode: this.bankObj.verifyCode
        }
        apiCheckSmsVerification(params).then(res=>{
          if (res.code === 'SUCCESS') {
            this.$router.push({
              path: '/'+ this.routerFrom,
              query: {
                bankObj: JSON.stringify({
                  bankName: res.data.bankName || '银行卡',
                  id: res.data.bankId || ''
                })
              }
            })
          } else {
            this.$toast(res.msg)
          }
        })
      }
    }
  };
</script>

<style lang="less">
  @import '~@/style/theme.less';
  .bank-card {
    .input {
      padding-right: 65px !important;
    }
    .dialog-box {
      box-sizing: border-box;
      position: absolute;
    }
    .dialog-tel {
      text-align: center;
      margin-bottom: 30px;
    }
    .van-border {
      border-radius:10px;
      border:1px solid rgba(153,153,153,1);
    }
    .verify-button {
      border: none;
      color: @theme-color;
      padding: 0;
      span {
        font-size:28px;
        font-family:PingFangSC-Medium;
        font-weight:500;
      }
    }
    .dialog-input-box {
      display: flex;
      border-radius:10px;
      justify-content: space-between;
      align-items: center;
      margin: 0 77px;
      padding: 0 26px;
      margin-bottom: 46px;
      .dialog-input {
        font-family:PingFangSC-Regular;
        font-weight:400;
        font-size:36px;
        width: calc(100% - 247px);
        height: 77px;
      }
      .btn-rese {
        border: 0;
        font-size:36px;
        color: @theme-color;
        white-space : nowrap;
        font-family:PingFangSC-Medium;
        font-weight:500;
      }
      .btn-disabled {
        color: #9b9b9b;
      }
    }
    .agremt {
      box-sizing: border-box;
      padding-left: 30px;
      margin-top: 30px;
      margin-bottom: 100px;
      div {
        display: flex;
        align-items: center;
        a {
          color: #566fff;
        }
      }
    }
  }
</style>