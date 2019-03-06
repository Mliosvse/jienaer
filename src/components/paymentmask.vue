<template>
  <div class="payment-mask" v-if="showPayment">
    <div class="mask-empty" @click="handleHidePayMask"></div>
    <div class="payment-box">
      <div class="payment-title">
        <van-icon class="left-icon-wrap" size="18px" name="arrow-left" @click="handleHidePayMask"></van-icon>
        <span>{{paymentTitle}}</span>
        <span class="forget-password" @click="handleGoToForget" :class="{'payment-hidden':!showForgetPwd}">忘记密码</span>
      </div>
      <div class="payment-input">
        <van-password-input
          v-model="password">
        </van-password-input>
      </div>
      <van-number-keyboard
        class="number-keyboard"
        :show="true"
        @input="handlePayment"
        @delete="handleDeletePwd">
      </van-number-keyboard>
    </div>
  </div>

</template>

<script>
  export default {
    props: {
      showPayment: {
        type: Boolean,
        default: false
      },
      showPayment1: {
        type: Boolean,
        default: false
      },
      paymentTitle: {
        type: String,
        default: ''
      },
      showForgetPwd: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        password: '' // 密码
      }
    },
    methods: {
      // 关闭遮罩
      handleHidePayMask () {
        this.password = ''
        this.$emit('update:showPayment1', false)
      },
      // 前往忘记密码页面
      handleGoToForget () {
        this.$emit('goToForget')
      },
      // 设置支付密码
      handlePayment (key) {
        this.password = (this.password + key).slice(0, 6)
        if (this.password.length === 6) {
          this.$emit('inputPwdComplete', this.password)
          setTimeout(()=>{
            this.password = ''
          }, 100)
        }
      },
      // 删除密码
      handleDeletePwd () {
        this.password = this.password.slice(0, this.password.length - 1)
      }
    }
  }
</script>

<style lang="less">
  .payment-mask {
    .mask-empty {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
    }
    .payment-box {
      width: 100%;
      position: fixed;
      z-index: 2000;
      bottom: 0;
      background: #fff;
      .payment-title {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #E6E6E6;
         .left-icon-wrap{
            flex: 0 0 0.5rem;
            width: 0.5rem;
            height: 0.5rem;
            line-height: 0.5rem;
            padding-left: 0.3rem;
          }
          span:nth-of-type(1) {
            flex: 1;
            font-size: 30px;
            text-align: center;
            padding-left: 0.4rem;
          }
          .forget-password{
            padding-right: 0.3rem;
            font-size: 26px;
            color: #333;
          }
          .payment-hidden {
            display: none;
          }

      }
      .van-number-keyboard {
        position: relative;
      }
      .payment-input {
        .van-password-input {
          margin: 0;
        }
      }
      .number-keyboard {}
    }
  }
</style>
