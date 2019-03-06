<template>
  <div class="order-detail-box">
    <div class="loading-mask" v-if="showLoding" >
      <van-loading color="white" class="spinner-loading" />
    </div>
    <div v-else class="order-detail">
      <!-- 100 审核中 -->
      <div class="result-box" v-if="this.orderDetail.status===100">
        <img src="@/assets/img/smallLoan/loan-review.png" alt="">
        <h4>贷款审核中</h4>
        <p>请耐心等待审批结果</p>
      </div>
      <!-- 101 审核不通过 -->
      <div class="result-box" v-if="this.orderDetail.status===101">
        <img src="@/assets/img/smallLoan/loan-review-failed.png" alt="">
        <h4>借款审批不通过</h4>
        <p>哎呀，您未通过借款审核，试试其他产品吧！</p>
      </div>
      <!-- 102 审核不通过 -->
      <div class="result-box" v-if="this.orderDetail.status===102">
        <img src="@/assets/img/smallLoan/LoansCancel.png" alt="">
        <h4>贷款取消</h4>
        <p>显示取消的原因，没有则不显示</p>
      </div>
      <!-- 104 审核通过 -->
      <div class="result-box" v-if="this.orderDetail.status===104">
        <img src="@/assets/img/smallLoan/loan-approval.png" alt="">
        <h4>借款审批通过</h4>
        <button class="sign-btn" @click="handleGoSign">签约借款</button>
        <p>请尽快签约借款，额度将于{{$format(this.orderDetail.expireTimes, 'yyyy-MM-dd')}}过期</p>
      </div>
      <!-- 105 签约失败 -->
      <div class="result-box" v-if="this.orderDetail.status===105">
        <img src="@/assets/img/smallLoan/sign-error.png" alt="">
        <h4>签约失败</h4>
        <p>哎呀，该笔订单借款签约失败，重新再借一次！</p>
      </div>
      <!-- 106 放款中 -->
      <div class="result-box" v-if="this.orderDetail.status===106">
        <img src="@/assets/img/smallLoan/loan-in.png" alt="">
        <h4>机构放款中</h4>
        <p>请注意查看{{this.orderDetail.bankCardInfo}}到帐情况</p>
      </div>
      <!-- 107 待还款 -->
      <div class="result-box" v-if="this.orderDetail.status===107">
        <img src="@/assets/img/smallLoan/await-repay.png" alt="">
        <h4>待还款</h4>

        <p v-if="this.repaydays===0||this.repaydays==='0'">今天是还款日，请注意及时还款。</p>
        <p v-else>距离还款日剩余<span>{{this.repaydays}}天</span>，请注意及时还款。</p>
      </div>
      <!-- 108 放款失败 -->
      <div class="result-box" v-if="this.orderDetail.status===108">
        <img src="@/assets/img/smallLoan/sign-error.png" alt="">
        <h4>放款失败</h4>
        <p>订单放款失败，建议重新申请借款</p>
      </div>
      <!-- 109 已结清 -->
      <div class="result-box" v-if="this.orderDetail.status===109">
        <img src="@/assets/img/smallLoan/settle.png" alt="">
        <h4>已结清</h4>
        <p>太棒了，你已经还清借款了！</p>
      </div>
      <!-- 110 逾期结清 -->
      <div class="result-box" v-if="this.orderDetail.status===110">
        <img src="@/assets/img/smallLoan/settle.png" alt="">
        <h4>逾期结清</h4>
        <p>太棒了，你已经还清借款了！</p>
      </div>
      <!-- 111 已逾期 -->
      <div class="result-box" v-if="this.orderDetail.status===111">
        <img src="@/assets/img/smallLoan/overdue.png" alt="">
        <h4>已逾期</h4>
        <p>你已<span>逾期{{this.repaydays}}天</span>，请立即还款，<br>以免影响你的信用生活</p>
      </div>
    
      <!-- 借款账单 -->
      <!-- 107待还款 || 109已结清 || 110逾期结清 || 111已逾期 -->
      <div
        class="borrow-bill"
        v-if="orderDetail.status===107||orderDetail.status===109||orderDetail.status===110||orderDetail.status===111">
        <div class="borrow-bill-title">
          <span>借款账单</span>
          <span
            v-if="handleRepaymentBtn()"
            class="repaymen"
            @click="handleGoRepayment(repayMentPlan[0])"
          >立即还款</span>
        </div>
        <ul>
          <li
            v-for="(item, index) in repayMentPlan" :key="index"
            @click="handleGoRepayment(item)">
            <div class="borrow-bill-detail">
              <div class="periods">
                <span>{{item.periodNo}}</span>
                <p>期次</p>
              </div>
              <div class="repay-amount">
                <span>{{item.realAmount}}</span>
                <p>借款金额(元)</p>
              </div>
              <div class="expire-date">
                <span>{{$format(item.dueTime*1000, 'yyyy-MM-dd')}}</span>
                <p>到期日</p>
              </div>
              <div class="status">
                <div>
                  <span>{{item.billStatus | disposeState}}</span>
                  <p>状态</p>
                </div>
              </div>
            </div>
            <div class="icon">
              <van-icon v-if="item.billStatus !== 2 && item.billStatus !== 4" name="arrow" size="16px" color="#ccc" />
            </div>
          </li>
        </ul>
      </div>

      <van-cell-group class="mt" v-if="!handleStatus(this.orderDetail.status)">
        <van-cell title="订单编号" center :value="orderDetail.orderNo" />
        <van-cell title="申请产品" center :value="orderDetail.orderName" />
        <van-cell title="申请金额" center :value="orderDetail.amount+'元'" />
        <van-cell title="申请期限" center :value="orderDetail.periodValue+'天'" />
        <van-cell title="申请时间" center :value="$format(orderDetail.addTime, 'yyyy-MM-dd hh:mm:ss')" />
      </van-cell-group>
      <van-cell-group class="mt" v-else>
        <van-cell title="订单编号" center :value="orderDetail.orderNo" />
        <van-cell title="申请产品" center :value="orderDetail.orderName" />
        <van-cell title="实际借款金额" center :value="orderDetail.realAmount+'元'" />
        <van-cell title="实际借款期限" center :value="orderDetail.realPeriodValue+'天'" />
        <van-cell title="签约提现时间" center :value="$format(orderDetail.signTimes, 'yyyy-MM-dd hh:mm:ss')" />

        <van-cell title="到账金额" center :value="orderDetail.reachAmount" />
        <van-cell title="商品金额" center :value="orderDetail.goodsAmount" />
        <van-cell title="服务费" center :value="orderDetail.poundage" />
        <van-cell
          title="已还金额" v-if="repayMentPlan.length"
          center is-link
          :value="repayMentPlan[0].paidAmount"
          @click="handleRepaymentDetail"
        />
        <van-cell title="借款协议" value="查看"
          center @click="showProtocol=true"
          value-class="value-class"
        />
      </van-cell-group>
      
      <van-actionsheet
        v-model="showProtocol"
        cancel-text="取消"
        :actions="protocolActions"
        @select="protocolSelect"
      />



      <!-- 推荐产品 -->
      <!-- <div class="good-loans" v-if="orderDetail.status === 101">
        <div class="info">精选贷款</div>
        <div
          class="recommend"
          v-for="(item, index) in recommendLoanList"
          :key="index"
          @click="handleGoProductDetail"
        >
          <div class="top">
            <img :src="item.imgUrl" alt="">
            <span>{{item.name}}</span>
            <jn-label type="danger" name="热卖"/>
            <jn-label type="primary" name="芝麻分600"/>
            <jn-label type="warning" name="下款快"/>
          </div>
          <div class="bottom">
            <div class="left">
              <p>流程简单，轻松秒借</p>
              <span>期限7-25天</span>
              <span>参考日利率0.04%</span>
            </div>
            <div class="right">
              <p>{{item.amount}}</p>
              <p>最高额度(元)</p>
            </div>
          </div>
        </div>
      </div> -->

      <!-- 105 签约失败 || 108放款失败 -->
      <jn-button class="one-btn" v-if="orderDetail.status===105||orderDetail.status===108" :click="handleGoProductDetail">再贷一笔</jn-button>
    </div>
  </div>
</template>

<script>
import { apiValidatePassword, apiFindOrderDetails, apiRepaymentPlan } from '@/api/borrow'
export default {
  data(){
    return {
      recommendLoanList: [
        { imgUrl: require('@/assets/img/smallLoan/order-lint-icon.png'), name:  '京东金融', amount: 3000 },
        { imgUrl: require('@/assets/img/smallLoan/order-lint-icon.png'), name: '京东金融', amount: 3000 }
      ], //商品列表
      showLoding: false,
      showProtocol: false,
      protocolActions: [
        {
          name: '《优享淘贷款协议》', type: 3
        },
        {
          name: '《优享淘委托融资协议》', type: 2
        }
      ],
      repayMentPlan: [], //还款计划，账单列表
      repaydays: '', //距离还款时间||逾期时间
      bankName: '', // 到账银行卡名字
      day: '10', // 距离还款日剩余天数
      overdueDay: '4', // 逾期天数
      staleTime: '2018-11-30 08:30', // 过期时间
      orderDetail: {} //订单数据
    }
  },
  mounted(){
    this.showLoding = true
    // 获取订单详情数据
    this.handleApiFindOrderDetails()
  },
  methods:{
    handleGoProductDetail(){
      this.$router.push({
        path: '/productDetail',
        query: {
          action: 'back_close_webview'
        }
      })
    },
    handleRepaymentDetail() {
      this.$router.push({
        path: '/repaymentDetail'
      })
    },
    protocolSelect(item) {
      this.$router.push({
        path: '/totalprotocol',
        query: {
          type: item.type,
          amount: this.orderDetail.realAmount,
          creditDay: this.orderDetail.realPeriodValue
        }
      })
    },
    handleApiFindOrderDetails() {
      let orderNo = localStorage.getItem('orderNo') || ''
      let params = {
        orderNo: orderNo
      }
      apiFindOrderDetails(params).then(res => {
        if (res.result.code === "1000") {
          this.orderDetail = res.result.data.orderInfo
          localStorage.setItem('tokenId', res.result.data.accessToken)
          let status = res.result.data.orderInfo.status
          if (status === 107 ||status === 109 || status === 110 || status === 111) {
            this.handleApiRepaymentPlan()
          }
          this.showLoding = false
        } else {
          this.$toast(res.result.msg)
        }
      })
    },
    handleApiRepaymentPlan() {
      let orderNo = localStorage.getItem('orderNo') || ''
      let params = {
        orderNo: orderNo
      }
      apiRepaymentPlan(params).then(res=>{
        if (res.result.code === '1000') {
          this.repayMentPlan = res.result.data.repaymentPlan
          this.repaydays = res.result.data.days
        }else {
          this.$toast(res.result.msg)
        }
      })
    },
    handleStatus (status) {
      let arr = [106, 107, 108, 109, 110, 111]
      let isFront = false
      if(arr.includes(status)) { isFront = true }
      return isFront
    },
    handleGoSign () {
      // 验证是否设置支付密码
      this.handleApiValidatePassword()
    },
    handleApiValidatePassword(){
      apiValidatePassword({}).then(res=>{
        if(res.result.code === '1000') {
          localStorage.setItem('tokenId', res.result.data.accessToken)
          // 1已设置，0未设置
          let path = '/signBorrow'
          if (!res.result.data.status) {
            path = '/borrow/forgetpwd'
          }
          this.$router.push({ path: path })
        }else {
          this.$toast(res.result.msg)
        }
      })
    },
    handleRepaymentBtn() {
      let status = this.repayMentPlan.find(item=>{
        return item.billStatus !== 2 && item.billStatus !== 4
      })
      return status
    },
    handleGoRepayment (item) {
      if (item.billStatus === 2) return
      if (item.billStatus === 4) return
      sessionStorage.setItem('billDetail', JSON.stringify(item))
      this.$router.push({
        path: '/billDetail'
      })
    }
  },
  filters: {
    disposeState (status) {
      if(status===1) return '未到期'
      if(status===2) return '已还款'
      if(status===3) return '逾期'
      if(status===4) return '还款中'
    }
  }
}
</script>

<style lang='less'>
  @import '~@/style/theme.less';
  .order-detail-box {
    .order-detail{
      .result-box {
        text-align: center;
        padding: 80px 0 60px;
        background-color: #fff;
        margin-bottom: 18px;
        .sign-btn {
          border: none;
          border-radius:30px;
          padding: 0 34px;
          height: 60px;
          line-height:60px;
          font-size:28px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#fff;
          background:@theme-color;
          margin-bottom: 40px;
        }
        img {
          height: 160px;
        }
        h4 {
          font-size:36px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:#333;
          line-height:50px;
          padding: 36px 0 50px;
        }
        p{
          font-size:32px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color: #4a4a4a;
          line-height:44px;
          span {
            color: #F56834;
          }
        }
      }
      .mt {
        margin-top: 18px;
      }
      .good-loans {
        margin-top: 18px;
        background: #fff;
        .info {
          color:#23262F;
          font-size:32px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          padding: 18px 32px;
        }
        .recommend {
          background: #fff;
          border-top: 1px solid #E8EAEF;
          padding: 44px 32px;
          .top {
            display: flex;
            align-items: center;
            padding-bottom: 12px;
            img {
              width: 52px;
              padding-right: 16px;
            }
            span {
              font-size:32px;
              font-family:PingFangSC-Medium;
              font-weight:500;
              color:#23262F;
              line-height:40px;
              padding-right: 28px;
            }
          }
          .bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 66px;
            padding-right: 14px;
            .left {
              p {
                font-size:30px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:#565F75;
                padding-bottom: 4px;
              }
              span {
                font-size:26px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color: #C1C0C4;
              }
              span:first-of-type {
                border-right: 1px solid #c1c0c4;
                padding-right: 11px;
              }
              span:last-of-type {
                padding-left: 10px;
              }
            }
            .right {
              text-align: center;
              p:first-of-type {
                font-size:40px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:#F8734E;
                padding-bottom: 4px;
              }
              p:last-of-type {
                font-size:26px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:#C1C0C4;
              }
            }
          }
        }
      }
      .borrow-bill {
        background: #fff;
        margin-top: 18px;
        .borrow-bill-title {
          padding: 0 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 90px;
          font-size:28px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(51,51,51,1);
          border-bottom: 1px solid #EBEBEB;
          .repaymen {
            font-size:28px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:@theme-color;
            line-height:40px;
            letter-spacing:2px;
          }
        }
        ul {
          li {
            padding: 28px 32px;
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .borrow-bill-detail {
              width: 94%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              > div {
                text-align: center;
                span {
                  font-size:30px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:#333;
                  line-height:42px;
                  padding-bottom: 8px;
                }
                p {
                  font-size:24px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:#999;
                }
              }
              .icon {
                width: 20px;
              }
            }
            .select{
              width: 15px;
              height: 30px;
              background: url("~@/assets/img/common/right_arrow.png") no-repeat center;
              background-size: 100%;
            }
          }
        }
      }
      .one-btn {
        margin-top: 60px;
      }
    }
    .value-class {
      color: @theme-color;
    }
  }
</style>
