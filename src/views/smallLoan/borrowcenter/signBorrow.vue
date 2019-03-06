<template>
  <div class="content sing-borrow-box">
    <div class="sign-borrow">
      <div class="limit">
        <p>根据你的资质，可借款</p>
        <div class="number">
          {{amount}}
          <i class="amend" @click="selectAmountShow=true"></i>
        </div>
      </div>
      <van-cell-group>
        <van-cell title="借款期限" :value="limit+'天'" @click="isShowCreditDay=true" is-link />
        <van-cell title="到账金额" :value="signTrialDetail.actualAmount+'元'"/>
        <van-cell title="服务费" :value="signTrialDetail.poundage+'元'"/>
        <van-cell title="还款总额" :value="signTrialDetail.repayAmount+'元'"/>
        <van-cell title="收款账号" :value="signDataDetail.bankCardInfo"/>
      </van-cell-group>

      <!-- <van-cell
        v-if="JSON.stringify(goods)==='{}'"
        title="请选择商品"
        value="请选择"
        @click="handleGoods"
        class="mt"
        center
        is-link
      /> -->
      <!-- <div v-else class="goods mt"> -->
      <div class="goods mt">
        <div class="img-box">
          <img src="@/assets/img/smallLoan/bracelet.png" alt="">
        </div>
        <div class="goods-info clearfix">
          <div class="goods-title">{{goodsList[0].title}}</div>
          <div class="goods-amount">￥{{signTrialDetail.goodsAmount}}元</div>
          <!-- <div class="goods-addbtn">数量:{{1}}</div> -->
        </div>
      </div>
      <van-cell
        class="mt"
        v-if="!takeAddress.receiverMobile"
        title="请选择收货地址"
        value="请选择"
        @click="handleAddress"
        center
        is-link
      />
      <div v-else class="take-arrress-info mt" @click="handleAddress">
        <van-icon class="van-address-icon" name="arrow" />
        <span class="name">{{takeAddress.receiverName}}</span>
        <span class="tel">{{takeAddress.receiverMobile}}</span>
        <div class="address">{{takeAddress.detailAddress}}</div>
      </div>
      <van-notice-bar
        v-if="signDataDetail.remark"
        :text="signDataDetail.remark"
        left-icon="volume-o"
      />
    </div>

    <van-actionsheet
      v-model="selectAmountShow"
      :actions="selectAmountActions"
      @select="handleAmountSelect"
    />
    <van-popup v-model="isShowCreditDay" :overlay="true" position="bottom">
      <van-picker
        show-toolbar
        :columns="creditDayArr"
        @confirm="handleCreditDayArrChange"
        @cancel="isShowCreditDay = false"
      />
    </van-popup>

    <payment-mask
      :showPayment="showPayment"
      :showForgetPwd="showForgetPwd"
      :showPayment1.sync='showPayment'
      :paymentTitle="'请输入支付密码'"
      @goToForget="handleGoToForget"
      @inputPwdComplete="handleInputPwd">
    </payment-mask>
    <div class="loading-mask" v-if="repayShowLoding" >
      <van-loading color="white" class="spinner-loading" />
    </div>

    <div class="fiexd">
      <jn-button v-if="handleDisable()" class="suc-button" :click="handleConfirmBorrow">确认借款</jn-button>
      <jn-button v-else :disable="true" class="suc-button">确认借款</jn-button>
      <jnCheckbox
        class="checkbox"
        :is-check="isCheck"
        :handleClick="handleClick">
        我已阅读并同意
        <router-link :to="{path:'/totalprotocol',query: {type:3,amount:amount,creditDay:limit}}">《优享淘贷款协议》</router-link>、<router-link :to="{path:'/totalprotocol',query: {type:2,amount:amount,creditDay:limit}}">《优享淘委托融资协议》</router-link>
      </jnCheckbox>
    </div>
  </div>
</template>

<script>
import paymentMask from '@/components/paymentmask' // 支付密码组件
import { apiSignLoan, apiTrialAmount, apiConfirmLoan, apiValidatePayPassword } from '@/api/borrow'
export default {
  data () {
    return {
      showPayment: false,
      showForgetPwd: true,
      password: '',
      repayShowLoding: false,
      isCheck: true, //是否选中协议
      selectAmountShow: false, //显示可选贷款金额选项弹框
      selectAmountActions: [], //可选贷款金额选项
      goods: {}, //商品信息
      takeAddress: {}, //地址信息
      signDataDetail: {}, //签约数据
      signTrialDetail: {},
      amount: '', //已选金额
      showLoding: true,
      isShowCreditDay: false,
      creditDayArr: [], //可选期限
      limit: '', // 当前选中的期限
      goodsList: [
        {
          title: '鸡翅木手串 1.5cm'
        }
      ],
    }
  },
  mounted(){
    let goods = this.$route.query.goods
    let address = this.$route.query.address
    this.handleApiSignLoan()
    this.goodsList = goods ? JSON.parse(this.$route.query.goods) : this.goodsList
    this.takeAddress = address ? JSON.parse(this.$route.query.address) : this.takeAddress
  },
  methods: {
    handleCreditDayArrChange(value) {
      this.limit = value
      this.isShowCreditDay = false
    },
    handleInputPwd (pwd) {
      this.repayShowLoding = true
      // 调用还款api
      this.handleApiPayH5Repay(pwd)
    },
    handleApiPayH5Repay(pwd){
      let params = {
        payPassword: pwd
      }
      apiValidatePayPassword(params).then(res=>{
        this.repayShowLoding = false
        if (res.code==='SUCCESS') {
          this.handleApiConfirmLoan()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    handleDisable() {
      return Object.values(this.takeAddress).length && this.takeAddress.id > 0
    },
    handleApiSignLoan () {
      let params = {}
      Object.assign(params, {orderNo: localStorage.getItem('orderNo')})
      apiSignLoan(params).then(res=>{
        if (res.result.code === '1000') {
          this.signDataDetail = res.result.data
          this.creditDayArr = res.result.data.creditDay
          this.limit = this.creditDayArr[this.creditDayArr.length-1]
          if(!this.$route.query.address) {
            this.takeAddress = res.result.data.address
            let province = this.takeAddress.province === this.takeAddress.city ? '' : this.takeAddress.province
            this.takeAddress['detailAddress'] = province + this.takeAddress.city +this.takeAddress.region+this.takeAddress.address
          }
          // 默认选择最大可借款
          if (sessionStorage.getItem('amount')) {
            this.amount = sessionStorage.getItem('amount')
          } else {
            this.amount = res.result.data.maxAmount
          }
          let maxAmount = res.result.data.maxAmount
          let minAmount = res.result.data.minAmount
          let amountArr = []
          while(minAmount <= maxAmount){
            amountArr.push({name: minAmount})
            minAmount = minAmount + 100
          }
          // 可选借款金额
          this.selectAmountActions = [...amountArr]
          this.handleApiTrialAmount()
        }else {
          this.$toast(res.result.msg)
        }
      })
    },
    handleAmountSelect(val) {
      this.showLoding=true
      this.selectAmountShow = false
      this.amount = val.name
      this.handleApiTrialAmount()
    },
    handleApiTrialAmount(){
      let params = {}
      params.orderNo = localStorage.getItem('orderNo')
      params.amount = this.amount
      params.termType = 1
      params.peroid = this.limit
      apiTrialAmount(params).then(res=>{
        if (res.result.code === '1000') {
          this.showLoding = false
          this.signTrialDetail = res.result.data
        } else {
          this.$toast(res.result.msg)
        }
      })
    },
    handleClick () {
      this.isCheck = !this.isCheck
    },
    handleGoToForget(){
      this.$router.push({
        path: '/repayment/forgetpwd'
      })
    },
    handleGoods() {
      this.$router.push({
        path: '/goodsList',
        query: {
          address: this.$route.query.address,
          amount: this.signTrialDetail.goodsAmount
        }
      })
    },
    handleConfirmBorrow() {
      if (!this.isCheck) {
        this.$toast('请阅读并同意协议后操作')
        return
      }
      if (JSON.stringify(this.takeAddress) === '{}' || this.takeAddress.id == 0) {
        this.$toast('请选择收货地址')
        return
      }
      this.showPayment = true
    },
    handleApiConfirmLoan() {
      let params = {}
      params.orderNo = localStorage.getItem('orderNo') // 订单号
      params.amount = this.amount //借款金额
      params.loanTerm = this.limit // 借款期限
      params.termType = 1 // 期限单位
      params.shopId = 1 //商品id
      params.shopName = this.goodsList[0].title // 商品名称
      params.buynum = 1 // 商品数量
      params.shopAmount = this.signTrialDetail.goodsAmount // 商品金额
      params.addressId = this.takeAddress.id // 地址id
      params.actualAmount = this.signTrialDetail.actualAmount
      params.poundage = this.signTrialDetail.poundage
      apiConfirmLoan(params).then(res=>{
        if(res.result.code === '1000') {
          this.$router.push({
            path: '/orderDetail',
            query: {
              action: 'back_close_webview'
            }
          })
        } else {
          this.$toast(res.result.msg)
        }
      })
    },
    handleAddress () {
      this.$router.push({
        path: '/myAddress',
        query: {
          goods: this.$route.query.goods
        }
      })
    }
  },
  components: {
    paymentMask
  },
  beforeDestroy(){
    sessionStorage.setItem('amount', this.amount)
  }
}
</script>

<style lang="less">
  .sing-borrow-box {
    height: 100%;
  .sign-borrow {
    height: calc(100% - 300px);
    overflow: auto;
    .limit {
      width: 100%;
      background: url('~@/assets/img/smallLoan/sign-borrow-bg.png') no-repeat;
      background-size: cover;
      padding-top: 42px;
      padding-bottom: 62px;
      text-align: center;
      p {
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#fff;
        line-height:40px;
        padding-bottom: 10px;
      }
      .number {
        color: #fff;
        font-size:80px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        line-height:82px;
      }
      .amend {
        width: 30px;
        height: 30px;
        display: inline-block;
        background: url('~@/assets/img/smallLoan/amend.png') no-repeat;
        background-size: cover;
      }
    }
    .mt {
      margin-top: 18px;
    }
    .take-arrress-info {
      padding: 30px 32px;
      background: #fff;
      position: relative;
      .van-address-icon {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        color: #969799;
      }
      .name {
        padding-right: 20px;
      }
      .name, .tel{
        font-size:32px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:44px;
      }
      .address {
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:40px;
      }
    }
    .goods {
      padding: 40px 32px;
      background: #fff;
      .img-box {
        float: left;
        width: 160px;
        border-radius: 18px;
        overflow: hidden;
        img {
          width: 100%;
          font-size: 0;
        }
      }
      .goods-info {
        padding-left: 188px;
        .goods-title {
          font-size:32px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#999;
          line-height:44px;
          padding-bottom: 12px;
        }
        .goods-amount {
          font-size:40px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:#F56834;
          float: left;
        }
        .goods-addbtn {
          font-size:32px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#4a4a4a;
          float: right;
        }
      }
    }
  }
  .fiexd {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    height: 300px;
    background: rgb(250, 250, 250);
    border-top: 1px solid rgb(242, 242, 242);
    .checkbox {
      .circle {
        float: left;
      }
      margin-left: 32px;
      margin-bottom: 80px;
    }
    .suc-button {
      margin-top: 50px;
      margin-bottom: 20px;
    }
  }
  }
</style>
