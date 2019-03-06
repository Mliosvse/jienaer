<template>
  <div>
    <div class="loading-mask" v-if="showLoading">
      <van-loading color="white" class="spinner-loading" />
    </div>
    <div class="totalProtocol" v-else v-html="html">
    </div>
  </div>
</template>

<script>
  import { apiGetContracts } from '@/api/borrow'
  export default {
    data () {
      return {
        html: '',
        showLoading: false
      }
    },
    mounted () {
      this.handleGetProtocol()
    },
    methods: {
      handleGetProtocol () {
        let type = this.$route.query.type || ''
        let amount = this.$route.query.amount || ''
        let creditDay = this.$route.query.creditDay || ''
        let titleObj = {
          '1': '绑卡协议',
          '2': '优享淘委托融资协议',
          '3': '优享淘贷款协议'
        }
        document.title = titleObj[type] || '错误type'
        apiGetContracts({
          orderNo: localStorage.getItem('orderNo')||'1901121235825001',
          amount: amount, //借款金额
          loanTerm: creditDay, //借款期限
          termType: 1, //期限单位 1：天 2：月
          contractType: type //协议类型 1：绑卡 2：优享淘委托融资协议 3：优享淘贷款协议(借款合同)
        }).then(res => {
          if (res.result.code === '1000') {
            this.html = res.result.data.content;
          } else {
            this.$toast(res.result.msg);
          }
        })
      }
    }
  }
</script>

<style lang='less'>

.totalProtocol{
  font-size: 0.25rem;
	padding: 0.25rem;
  line-height: 0.48rem;
	text-align: Justify;
  text-justify: inter-ideograph;
  .p1{
    white-space: pre-wrap;
    *word-wrap: break-word;
    *white-space : normal;
  }
  table {
    border-collapse:collapse;
  }
  table, td, tr, th {
    border: 1px solid #000;
  }
}
</style>
