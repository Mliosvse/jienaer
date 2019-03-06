<template>
  <div class="repayment-detail">
    <div class="loading-mask" v-if="showLoding" >
      <van-loading color="white" class="spinner-loading" />
    </div>
    <ul v-else>
      <div v-if="!repayList.length" class="list-null">
        <img src="@/assets/img/smallLoan/order_list_null.png" alt="">
        <p>您还没有还款记录哦…</p>
        <!-- <p>暂未有还款记录</p> -->
      </div>
      <li v-else class="mt" v-for="(item, index) in repayList" :key="index">
        <div class="bank-card">{{item.bankName}}</div>
        <div class="amount">{{item.repayAmount}}元</div>
        <div class="time">{{$format(item.repayTime*1000, 'yyyy-MM-dd hh:mm:ss')}}</div>
        <div class="status">{{item.result | dispatchResult}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { apiGetRepaymentDetail } from '@/api/borrow'
export default {
  data() {
    return {
      repayList: [],
      showLoding: false
    }
  },
  mounted() {
    this.showLoding = true
    let orderNo = localStorage.getItem('orderNo') || ''
    let params = {
      orderNo: orderNo
    }
    apiGetRepaymentDetail(params).then(res=>{
      if (res.code === 'SUCCESS') {
        this.repayList = res.data
      }else {
        this.$toast(res.msg)
      }
      this.showLoding = false
    })
  },
  methods: {},
  filters: {
    dispatchResult(result) {
      if (result === 0) return '还款申请中'
      if (result === 1) return '还款成功'
      if (result === 2) return '还款处理中'
      if (result === -1) return '还款失败'
    }
  }
}
</script>

<style lang="less">
  .repayment-detail {
    ul {
      li {
        display: flex; flex-wrap: wrap;
        align-items: center; background: #fff;
        padding: 30px 32px 24px;
        div {
          width: 50%;
        }
        .amount, .status {
          text-align: right;
        }
        .bank-card {
          padding-bottom: 16px; font-size:32px;
          font-family:PingFangSC-Regular; font-weight:400;
          color:rgba(51,51,51,1); line-height:32px;
        }
        .amount {
          padding-bottom: 16px; font-size:32px;
          font-family:PingFangSC-Regular; font-weight:400;
          color:rgba(245,104,52,1); line-height:32px;
        }
        .time {
          font-size:28px; font-family:PingFangSC-Regular;
          font-weight:400; color:rgba(153,153,153,1);
          line-height:40px;
        }
        .status {
          font-size:28px; font-family:PingFangSC-Regular;
          font-weight:400; color:rgba(153,153,153,1);
          line-height:40px;
        }
      }
    }
    .list-null {
      position: absolute;
      top: 136px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      width: 100%;
      img {
        width: 244px;
      }
      p:nth-of-type(1){
        margin-top: 40px;
        font-size:44px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:60px;
      }
      p:nth-of-type(2){
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:40px;
      }
    }
  }

</style>
