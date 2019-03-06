<template>
  <div class="order-list">
    <div class="loading-mask" v-if="showLoading">
      <van-loading color="white" class="spinner-loading" />
    </div>
    <div class="list-box" v-else>
      <div v-if="!orderList.length" class="list-null">
        <img src="@/assets/img/smallLoan/order_list_null.png" alt="">
        <p>您还没有订单哦…</p>
        <!-- <p>暂未有订单</p> -->
      </div>
      <ul v-else>
        <li
          v-for="(item, index) in orderList"
          :key="index"
          @click="handleGoOrderDetail(item.id, item.orderNo,item.status)"
        >
          <div class="title">
            <div class="product-name">
              <img src="@/assets/img/smallLoan/goods.png" alt="">
              <span>{{item.orderName}}</span>
            </div>
            <div class="type">{{item.statusDesc}}</div>
          </div>
          <div class="order-info" v-if="!handleStatus(item.status)">
            <div class="order-text">
              <div class="amount">申请金额：<span>{{item.amount}}</span>元</div>
              <div class="limit">借款期限：<span>{{item.periodValue}}</span>天</div>
              <div class="time">申请时间：<span>{{$format(item.addTime, 'yyyy-MM-dd')}}</span></div>
            </div>
            <button class="btn">{{btnValue|changeBtnVal(item.status)}}</button>
          </div>

          <div class="order-info" v-else>
            <div class="order-text">
              <div class="amount">实际借款金额：<span>{{item.realAmount}}</span>元</div>
              <div class="limit">实际借款期限：<span>{{item.realPeriodValue}}</span>天</div>
              <div class="time">签约提现时间：<span>{{$format(item.signTimes, 'yyyy-MM-dd')}}</span></div>
            </div>
            <button class="btn">{{btnValue|changeBtnVal(item.status)}}</button>
          </div>
        </li>
      </ul>
      
    </div>
  </div>
</template>

<script>
import {apiFindOrderList} from '@/api/borrow'
export default {
  data(){
    return {
      orderList: [],
      showLoading: true,
      selectType: '',
      btnValue: '查看详情'
    }
  },
  filters: {
    changeBtnVal(val, status){
      if (status === 112) {
        return '立即补充'
      } else {
        return '查看详情'
      }
    }
  },
  methods: {
    handleStatus (status) {
      let arr = [106, 107, 108, 109, 110, 111]
      let isFront = false
      if(arr.includes(status)) { isFront = true }
      return isFront
    },
    handleApiFindOrderList(){
      let params = {
        selectType: this.selectType
      }
      apiFindOrderList(params).then(res => {
        if (res.result.code === '1000') {
          this.showLoading = false
          this.orderList = res.result.data.orderList
          if (this.orderList.status === 112) {
            this.btnValue = '立即补充'
          }
        }
      })
    },
    handleGoOrderDetail (id, orderNo, status) {
      localStorage.setItem('orderNo', orderNo)
      if (status === 112) {
        this.$router.push({
          path: '/productDetail',
          query: {
            id: id
          }
        })
      }else {
        this.$router.push({
          path: '/orderDetail',
          query: {
            id: id
          }
        })
      }
    }
  },
  mounted(){
    this.selectType = this.$route.query.selectType || 4
    // 获取订单列表
    this.handleApiFindOrderList()
  }
}
</script>

<style lang="less">
  @import '~@/style/theme.less';
  .order-list {
    ul {
      li {
        margin-top: 18px;
        background: #fff;
        padding: 0 32px;
        .title{
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ddd;
          padding: 16px 0;
          .product-name {
            img {
              width: 60px;
              vertical-align: middle;
            }
            span {
              font-size:32px;
              font-family:PingFangSC-Regular;
              padding-left: 16px;
              font-weight:400;
              color:#333;
              vertical-align: middle;
            }
          }
          .type {
            font-size:28px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color: @theme-color;
            line-height:40px;
          }
        }
        .order-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 0;
          .order-text {
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#333;
            line-height:40px;
            span {
              color: #F56834;
            }
            .limit {
              padding: 12px 0;
            }
            .time {
              color: #999;
              span {
                color: #999;
              }
            }
          }
          .btn {
            border: 0;
            padding: 0;
            margin: 0;
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#fff;
            line-height:40px;
            padding: 10px 34px;
            background: @theme-color;
            border-radius: 40px;
          }
        }
      }
    }
    .list-null {
      position: absolute;
      top: 136px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
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
