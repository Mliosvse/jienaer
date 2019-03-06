<template>
  <div class="product-detail-box">
    <div class="loading-mask" v-if="showLoding" >
      <van-loading color="white" class="spinner-loading" />
    </div>
    <div class="product-detail" v-else>
      <div class="detail-box">
        <div class="product-info">
          <img src="@/assets/img/smallLoan/goods.png" alt="">
          <div class="title-box">
            <div class="title">{{productInfo.productName}}</div>
            <div class="title-btn-box">
              <div class="title-btn">易下款</div>
              <div class="title-btn red">额度高</div>
            </div>
          </div>
        </div>
        <div class="select-amount">
          <div class="amount">
            <span>金额</span>
            <div class="amount-value" @click="showAmountSelect = true">{{repayAmount}}元</div>
          </div>
          <div class="time">
            <span>期限</span>
            <div
              class="amount-value"
              @click="showLimitSelect=true">{{limit}}天</div>
          </div>
        </div>
        <div class="borrow-info">
          <div class="rate">
            <span>{{dayInterest}}%</span>
            <p>日利率</p>
          </div>
          <div class="repay-amount">
            <span>{{viewRepayAmount}}元</span>
            <p>预期还款金额</p>
          </div>
          <div class="interest">
            <span>{{viewInterest}}元</span>
            <p>预期利息</p>
          </div>
        </div>
      </div>

      <van-popup v-model="showAmountSelect" :overlay="true" position="bottom">
        <van-picker
          show-toolbar
          :columns="amountActions"
          @confirm="onAmountSelect"
          @cancel="showAmountSelect = false"
        />
      </van-popup>
      <van-popup v-model="showLimitSelect" :overlay="true" position="bottom">
        <van-picker
          show-toolbar
          :columns="limitActions"
          @confirm="onLimitSelect"
          @cancel="showLimitSelect = false"
        />
      </van-popup>

      <jn-cell name="资料认证" type="title"></jn-cell>
      <at-list
        v-for="(item, index) in authList"
        :key="index"
        :title="item[0] | disposeName"
        :state="item[1] | disposeState"
        :isLink="item[1]===3||item[1]===0||item[0]==='supplyStatus'?true:false"
        @click.native="handleGoAuth(index, item)"
      />
      <div v-if="status===0||status==='0'||status===2||status==='2'">
        <van-cell-group v-if="!bankcard.id" class="select-bank">
          <van-cell @click="handleBank" center title="选择银行卡" value="请选择" is-link />
        </van-cell-group>
        <van-cell-group v-else class="select-bank">
          <van-cell @click="handleBank" title="选择银行卡" :value="bankcard.bankName" center is-link />
        </van-cell-group>
      </div>
      <jn-button
        class="btn"
        :click="handleSubmit"
        :disable="isDisable">{{btnValue}}</jn-button>
    </div>
  </div>
</template>

<script>
import atList from '@/components/atList'
import {apiProductDetails, apiApplyLoan, apiBump, apiJumpOrderDetails} from '@/api/borrow'
import {apiAuthMobile, apiQueryUserAuthStatus} from '@/api/auth'
export default {
  computed: {
    viewInterest: function () {
      return (this.repayAmount * Number(this.limit) * (this.dayInterest/100)).toFixed(2)
    },
    viewRepayAmount: function () {
      return this.repayAmount + Number(this.viewInterest)
    }
  },
  data () {
    return {
      showLoding: true,
      productInfo: { productId: '1', productName: '优享淘', periodUnit: 1 },//产品信息
      islogin: true, // 是否登录
      dayInterest: 0.1, //日利率
      isDisable: true, //按钮是否禁用
      btnValue: '认证借款', // 按钮文案
      limit: '', //当前选择的期限
      repayAmount: '', //当前选择的借款金额
      showAmountSelect: false, //是否显示借款金额列表
      showLimitSelect: false, //是否显示期限天数
      amountActions: [], //选择借款金额列表
      limitActions: [], //可选期限列表
      authList: [], //认证项列表
      bankcard: {
        id: '',
        bankName: ''
      }, //选择的银行卡信息
      deviceInfo: {}, //设备信息
      status: '' //撞库状态
    }
  },
  mounted(){
    window.location.href = '/opennative?name=ENVIRONMENT_PARAMS' // 获取设备信息
    window.nativeGetEnvironmentParam = this.nativeGetEnvironmentParam // 获取设备信息回调
    // 获取登录状态
    if (localStorage.getItem('appInfo')) {
      const appInfo = JSON.parse(localStorage.getItem('appInfo'))
      this.islogin = appInfo.loginState === '1'
    }
    if (!this.islogin) {
      window.location.href ='/opennative?name=APP_LOGIN';
      this.isDisable = false
      this.btnValue = '认证借款'
      return
    }
    this.handleGetAuthList()
    if(!this.$route.query.bankObj) return
    this.bankcard = {
      ...JSON.parse(this.$route.query.bankObj)
    }
  },
  methods: {
    onAmountSelect(item) {
      this.showAmountSelect = false;
      this.repayAmount = item
    },
    onLimitSelect (item) {
      this.showLimitSelect = false;
      this.limit = item
    },
    handleBank () {
      if (!this.handleLogin()) return false
      this.$router.push({
        path: '/selectBank',
        query: {
          routerFrom: 'productDetail'
        }
      })
    },
    handleSubmit () {
      if (!this.handleLogin()) return false
      if (this.status == 2) {
        let orderNo = localStorage.getItem('orderNo') || ''
        let params = {
          orderNo: orderNo
        }
        apiJumpOrderDetails(params).then(res=>{
          if (res.result.code === '1000') {
            this.$router.push({
              path: '/orderDetail'
            })
          } else {
            this.$toast(res.result.msg)
          }
        })
        return
      }
      if (this.status === -2) {
        this.$router.push({
          path: '/orderDetail'
        })
        return
      }
      // 立即申请强风控
      this.handleGoApplyLoan()
    },
    async handleGoAuth (index, item) {
      if (!this.handleLogin()) return false
      let userName = localStorage.getItem('userName') || ''
      let params = {
        id: 'H5',
        userName: userName
      }
      await apiQueryUserAuthStatus(params).then(res=>{
        if (res.result.code === '1000') {
          this.authList = Object.entries(res.result.data)
        } else {
          this.$toast(res.result.msg)
        }
      })
      item = this.authList[index] || item
      // 判断当前项之前是否有待认证项
      let authArr = this.authList.slice(0, index)
      for(let i=0; i<authArr.length; i++){
        if (authArr[i].includes(0)) {
          this.$toast('请按顺序进行认证');
          return false
        }
      }
      // 如果当前项已认证或认证中就不能点击
      if (item[1] !== 0 && item[1] !== 3 && item[0] !== 'supplyStatus') {
        return false
      }
      if (item[0] === 'mobileStatus') {
        apiAuthMobile().then(res=>{
          if(res.result.code === "1000") {
            window.location = '/opennative?name=WEBVIEW&params='+this.$base64.encodeURI(JSON.stringify({"url": res.result.data.url}))
          } else {
            this.$toast(res.result.msg)
          }
        })
      }
      if (item[0] === 'supplyStatus') {
        this.$router.push({
          path: '/auth/supplementData',
          query: {
            routerFrom: 'productDetail'
          }
        })
      }
      if (item[0] === 'realStatus') {
        window.location = '/opennative?name=IDENTITY_AUTH'
      }
    },
    handleLogin () {
      if (this.islogin) return true
      window.location = '/opennative?name=APP_LOGIN'
      return false
    },
   handleGetAuthList() {
      // 获取认证列表接口
      apiProductDetails({}).then(res=>{
        if(res.result.code === "1000"){
          this.authList = Object.entries(res.result.data.userAuth)
          // 0待认证， 1已认证， 2认证中
          let ArrAuthListValue = Object.values(res.result.data.userAuth)
          this.limitActions = res.result.data.product.periodValue
          this.limit = this.limitActions[this.limitActions.length-1]

          let incrValue = Number(res.result.data.product.incrValue)
          let minAmount = Number(res.result.data.product.minAmount)
          let maxAmount = Number(res.result.data.product.maxAmount)
          let amountArr = []
          while(minAmount <= maxAmount){
            amountArr.push(minAmount)
            minAmount = minAmount + incrValue
          }
          this.amountActions = [...amountArr]
          this.repayAmount = this.amountActions[this.amountActions.length-1]
          this.isDisable = true
          let handleBtnValue = () => {
            this.showLoding = false
            if (ArrAuthListValue.includes(2)) {
              this.btnValue = '认证中，请稍后'
              return
            }
            if (ArrAuthListValue.includes(0)) {
              this.btnValue = '请先完成申请资料'
              return
            }
            if (!this.bankcard.id) {
              this.btnValue = '请补充资料后申请'
              return
            }
            if(!ArrAuthListValue.includes(0) && !ArrAuthListValue.includes(2)){
              this.isDisable = false
              this.btnValue = '立即申请'
            }
          }
          if (ArrAuthListValue[0]===1) {
            let pro = this.handleApiBump()
            pro.then(res=>{
              if (!res) return
              handleBtnValue()
            })
          } else {
            handleBtnValue()
          }
        }else if(res.result.code === '1003'){
          window.location.href = '/opennative?name=APP_LOGIN'
        }else {
          this.$toast(res.result.msg)
        }
      })
    },
    async handleApiBump () {
      let isOk = false
      let orderNo = localStorage.getItem('orderNo') || ''
      let params = {
        productId: this.productInfo.productId, // 产品Id
        productName: this.productInfo.productName, // 产品名称
        periodUnit: this.productInfo.periodUnit, // 产品期限
        amount: this.repayAmount, // 借款金额
        borrowDay: this.limit, // 借款期限
        orderNo: orderNo
      }
      await apiBump(params).then(res=>{
        if(res.result.code === '1000') {
          localStorage.setItem('tokenId', res.result.data.token)
          localStorage.setItem('orderNo', res.result.data.orderNo)
          this.status = res.result.data.status
          // 1：黑名单
          let status = res.result.data.status
          if (status===1) {
            this.btnValue = '您暂不符合借款条件'+res.result.data.remark || ''
          } else if (status===-1) {
            this.btnValue = '当天申请人数已满，明日请早'
          } else if (status===-2) {
            this.isDisable = false
            this.btnValue = '当前有进行中的订单，查看详情'
          } else {
            isOk = true
          }
          this.showLoding = false
        } else {
          this.$toast(res.result.msg)
        }
      })
      return isOk
    },
    handleGoApplyLoan() {
      let deviceInfo = localStorage.getItem('deviceInfo')
      let params = {
        orderNo: localStorage.getItem('orderNo'), // 订单号
        deviceInfo: JSON.parse(deviceInfo) //用户设备信息
      }
      apiApplyLoan(params).then(res => {
        if (res.result.code === '1000'){
          this.$router.push({ path: '/applyResult' })
        }else {
          this.$toast(res.result.msg)
        }
      })
    },
    nativeGetEnvironmentParam(str) {
      let deviceInfo = JSON.parse(this.$base64.decode(window.decodeURIComponent(str)))||{};
      if (deviceInfo.coordinateX) {
        localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo))
      }
    }
  },
  filters: {
    disposeName (name) {
      if (name === 'mobileStatus') return '运营商认证'
      if (name === 'realStatus') return '身份认证'
      if (name === 'supplyStatus') return '补充信息认证'
    },
    disposeState(state) {
      if (state === 0 || state === -1) return '待认证'
      if (state === 1) return '已认证'
      if (state === 2) return '认证中'
      if (state === 3) return '认证过期'
    }
  },
  components:{
      atList
  }
}
</script>

<style lang="less">
  @import '~@/style/theme.less';
  .product-detail {
    .detail-box {
      background: #fff;
      margin-bottom: 18px;
      padding-top: 32px;
      .product-info {
        padding: 0 50px;
        display: flex;
        align-items: center;
        height: 120px;
        padding-bottom: 28px;
        img {
          height: 100%;
          border-radius: 20px;
        }
        .title-box {
          padding-left: 26px;
          .title {
            font-size:32px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color: #333;
            padding-bottom: 26px;
          }
          .title-btn-box {
            display: flex;
            .title-btn {
              width:92px;
              height:32px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
              border: 1px solid @theme-color;
              border-radius: 32px;
              color: @theme-color;
              background:#fff;
              margin-right: 20px;
            }
            .title-btn.red {
              color: rgb(240, 78, 78);
              border: 1px solid rgb(240, 78, 78);
            }
          }
        }
      }
      .select-amount {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 50px;
        padding: 0 16px 28px;
        border-bottom: 1px solid #ddd;
        .amount, .time{
          display: flex;
          align-items: center;
          span {
            padding-right: 20px;
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#333;
            line-height:40px;
          }
          .amount-value {
            width:200px;
            border-radius:30px;
            border:2px solid #ddd;
            font-size:28px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color: @theme-color;
            box-sizing: border-box;
            background: url('~@/assets/img/smallLoan/product-select-icon.png') no-repeat center right;
            background-size: contain;
            background-origin: content-box;
            text-align: center;
          }
        }
      }
      .borrow-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        padding-top: 22px;
        padding-bottom: 26px;
        div {
          flex: 1;
          span {
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#333;
            line-height:40px;
          }
          p {
            font-size:20px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#9B9B9B;
            line-height:28px;
          }
        }
        div:nth-of-type(2) {
          border-left: 1px solid #EBEBEB;
          border-right: 1px solid #EBEBEB;
        }
      }
    }
    .select-bank {
      margin-top: 18px;
    }
    .btn {
      margin-top: 92px;
    }
  }
</style>
