<template>
  <div class="apply-result">
    <img src="@/assets/img/smallLoan/applying.png" alt="">
    <h4>贷款申请审核中…</h4>
    <p>请注意后续审核结果</p>
    <!-- <jn-button class="button">查看其它产品</jn-button> -->
    <jn-button type="white" class="button" :click="handleGoOrderList">我的订单</jn-button>
  </div>
</template>

<script>
export default {
  methods: {
    handleGoOrderList () {
      this.$router.push({
        path: '/orderDetail'
      })
    }
  }
}
</script>

<style lang="less">
  .apply-result {
    text-align: center;
    img {
      width: 244px;
      height: auto;
      margin-top: 136px;
      margin-bottom: 40px;
    }
    h4 {
      font-size: 44px;
      font-weight: 400;
      color: #333;
      font-family:PingFangSC-Regular;
    }
    p {
      font-size: 28px;
      color: #999;
      font-family:PingFangSC-Regular;
    }
    .button {
      margin-top: 114px;
      margin-bottom: 40px;
    }
  }
</style>
