<template>
  <div class="bind-bank-card">
    <bank-card
      :bankTitleObj="bankTitleObj"
    >
    </bank-card>
    <div class="loading-mask" v-if="showLoading">
      <van-loading color="white" class="spinner-loading" />
    </div>
  </div>
</template>

<script>
import bankCard from '@/components/bankcard'
export default {
  data(){
    return {
      showLoading: false,
      bankTitleObj: {
        realNameTitle: '持卡人',
        cardNumTitle: '银行卡号',
        cardNumPd: '请选择银行卡号',
        bankNameTitle: '开户行',
        bankNamePd: '请选择所属银行',
        idnumber: '请输入身份证号'
      }
    }
  },
  components: {
    bankCard
  }
}
</script>

<style lang="less">
.bind-bank-card {
  
}
</style>
