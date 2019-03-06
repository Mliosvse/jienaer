<template>
  <div class="bill-detail">
    <van-cell-group>
      <van-cell title="本期账单" center />
      <van-cell title="期数" center :value="'第'+billDetailRepayment.periodNo+'期'"/>
      <van-cell title="状态" center :value="billDetailRepayment.billStatus | billStatus"/>
      <van-cell title="应还金额" center :value="billDetailData.amount+'元'"/>
      <van-cell title="" center :label="billDetailData.remark"/>
    </van-cell-group>

    <van-cell-group v-if="bankcard.id===''" class="select-bank">
      <van-cell @click="handleBank" center title="选择银行卡" value="请选择" is-link />
    </van-cell-group>
    <van-cell-group v-else class="select-bank">
      <van-cell @click="handleBank" center title="选择银行卡" :value="bankcard.bankName" is-link />
    </van-cell-group>
    <!-- 输入还款金额 -->
    <div class="repayamount-box select-bank">
      <label for="repayamount">还款金额</label>
      <input
        id="repayamount"
        :placeholder="'最低'+billDetailData.minAmount+'元起还'"
        :disabled="isDisable"
        v-model="repayAmount"
        class="repayamount"
        autocomplete="off"
        @blur="handleBlur()"
        @click="handleClickInput()"
        @input="handleValue()"
        ref="amountInput"
      />
      <div>元</div>
    </div>
    <jn-button class="btn" :click="handleRepayment">立即还款</jn-button>

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
  </div>
</template>

<script>
import paymentMask from '@/components/paymentmask' // 支付密码组件
import {apiPayH5Repay, apiRepayInfo, apiGetUserBindBankCardList} from '@/api/borrow'
export default {
  data(){
    return {
      showPayment: false,
      showForgetPwd: true,
      repayAmount: '', //还款金额
      password: '',
      bankcard: {},
      billDetailData: {},
      billDetailRepayment: {},
      isDisable: false,
      repayShowLoding: false
    }
  },
  mounted() {
    let billDetail = sessionStorage.getItem('billDetail') || '{}'
    this.billDetailRepayment = JSON.parse(billDetail)
    this.handleApiRepayInfo()
    if (!this.$route.query.bankObj) {
      this.handleApiGetUserBindBankCardList()
    } else {
      this.bankcard = {
        ...JSON.parse(this.$route.query.bankObj)
      }
    }
  },
  methods: {
    handleApiGetUserBindBankCardList() {
      let userMobile = localStorage.getItem('userName') || ''
      let params = {
        userMobile: userMobile //用户手机号码
      }
      apiGetUserBindBankCardList(params).then(res=>{
        if (res.code === 'SUCCESS') {
          let cardObj = res.data.userBankCardList.find(item=>{
            return item.isMain === true
          })
          this.bankcard = cardObj || {}
          localStorage.setItem('realName', res.data.realName)
          localStorage.setItem('idNumber', res.data.idNumber)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    handleBlur() {
      window.scrollTo(0,0);
    },
    handleClickInput() {
      this.$refs.amountInput.focus()
      let val = this.$refs.amountInput.value
      this.$refs.amountInput.value = ''
      this.$refs.amountInput.value = val
    },
    handleValue() {
      this.$refs.amountInput.value = this.$refs.amountInput.value.replace(/[^\d]/g, '')
    },
    handleApiRepayInfo(){
      let orderNo = localStorage.getItem('orderNo') || ''
      let params = {
        orderNo: orderNo,
        periodNos: this.billDetailRepayment.periodNos
      }
      apiRepayInfo(params).then(res => {
        if (res.code === 'SUCCESS') {
          this.repayAmount = res.data.amount
          this.billDetailData = {...res.data}
          if(this.repayAmount > 100) {
            this.isDisable = false
          } else {
            this.isDisable = true
          }
        }else {
          this.$toast(res.msg)
        }
      })
    },
    handleApiPayH5Repay(pwd){
      let orderNo = localStorage.getItem('orderNo') || ''
      let params = {
        orderNo: orderNo,
        cardId: this.bankcard.id,
        payPwd: pwd,
        actualAmount: this.repayAmount
      }
      apiPayH5Repay(params).then(res => {
        this.repayShowLoding = false
        if (res.code === 'SUCCESS') {
          if (res.data.respCode == '1000') {
            this.showPayment = false
            this.showPaymentAgain = true
            this.$dialog.alert({
              title: '还款申请已提交',
              message: '请耐心等待还款结果'
            }).then(() => {
              this.$router.replace({
                path: '/orderDetail',
                query: {
                  action: 'back_close_webview'
                }
              })
            });
          } else {
            this.$toast(res.data.finishName+res.data.finishDesc)
          }
          
        }else {
          this.$toast(res.msg)
        }
      })
    },
    handleBank() {
      this.$router.push({
        path: '/selectBank',
        query: {
          routerFrom: this.$route.name,
          bankid: this.bankcard.id
        }
      })
    },
    handleRepayment () {
      // 还款金额不能大于应还金额
      if (this.repayAmount > this.billDetailData.amount) {
        this.repayAmount = this.billDetailData.amount
      }
      if (!this.bankcard.id) {
        this.$toast('请选择还款银行卡')
        return
      }
      if(Number(this.repayAmount)>100) {
        if (Number(this.repayAmount) < Number(this.billDetailData.minAmount)) {
          this.$toast('最低'+this.billDetailData.minAmount+'元起还')
          return
        }
      }
      this.showPayment = true
    },
    handleInputPwd (pwd) {
      this.repayShowLoding = true
      // 调用还款api
      this.handleApiPayH5Repay(pwd)
    },
    // 前往忘记密码页
    handleGoToForget(){
      this.$router.push({
        path: '/repayment/forgetpwd'
      })
    }
  },
  filters: {
    billStatus (status) {
      if (status==1) return '未到期'
      if (status==2) return '已还款'
      if (status==3) return '逾期'
    }
  },
  components: {
    paymentMask
  }
}
</script>

<style lang="less">
  .bill-detail {
    .btn {
      margin-top: 60px;
    }
    .select-bank {
      margin-top: 18px;
    }
    .inputValue {
      text-align: right;
    }
    .repayamount-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      height: 100px;
      padding: 0 32px;
      font-size: 30px;
      position: relative;
      label {
        display: inline-block;
        width: 300px;
      }
      input {
        text-align: right;
        font-size: 30px;
      }
      div {
        padding-left: 10px;
        font-size: 30px;
      }
    }
  }
</style>
