<template>
  <div class="auth-mobile-result">
    <img class="icon" src="@/assets/img/smallLoan/applying.png">
    <p class="p1">系统正在处理中…</p>
    <p class="p2">如收到运营商提醒短信为正常现象</p>
    <jn-button class="btn" :click="handleGotoAuthList">确定</jn-button>
  </div>
</template>

<script>
  import { apiBackMobile } from '@/api/auth' // 获取魔蝎运营商回调参数

  export default {
    data () {
      return {
      }
    },
    created () {
      this.handleMobileResult()
      console.log('运营商', window.location.host)
    },
    methods: {
      handleGotoAuthList() {
        window.location = '/opennative?name=CLOSE_WEBVIEW'
      },
      // 运营商回调接口
      handleMobileResult () {
        // let mobileReqTimeStamp = this.$getUrlPara('mobileReqTimeStamp')
        let mxcode = this.$getUrlPara('mxcode')
        let account = this.$getUrlPara('account')
        let userId = this.$getUrlPara('userId')
        apiBackMobile({
          'mxcode': mxcode,
          'account': account,
          'userId': userId
        }).then(res => {
          if (res.result.code === '1000') {
          } else {
            this.$toast(res.result.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .auth-mobile-result {
    text-align: center;
    padding-top: 136px;
    .btn {
      margin-top: 50px;
    }
    .icon{
      width: 244px;
      margin: 0 auto;
    }
    .p1{
      font-size:44px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:60px;
      margin-top: 40px;
    }
    .p2{
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:40px;
    }
  }
</style>
