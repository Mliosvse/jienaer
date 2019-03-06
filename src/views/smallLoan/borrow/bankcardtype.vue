<template>
  <div class="content bank-card-type">
    <div class="loading-mask" v-if="showLoading">
      <van-loading color="white" class="spinner-loading" />
    </div>
    <ul v-else>
      <li
        @click="handleChooseBankcard(item, index)"
        v-for="(item, index) of getMap" :key="index"
        :class="handleSetGray(item)">
        <img class="bankcard-icon" :src="item.bankIcon">
        <div class="bankcard-info">
          <span>{{ item.bankName }}</span>
          <span v-if="item.isMaintain === 1" class="repair">银行卡维护中...</span>
          <span class="right">储蓄卡</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { apiGetFindBankList } from '@/api/borrow'

  export default {
    data () {
      return {
        getMap: [],
        routerFrom: '',
        showLoading: true
      }
    },
    created () {
      this.routerFrom = this.$route.query.routerFrom
      this.handleGetBankcardList()
    },
    methods: {
      // 给银行卡置灰
      handleSetGray (item) {
        if (item.isMaintain === 1) {
          return ['gray']
        }
      },
      // 获取银行卡列表
      handleGetBankcardList () {
        apiGetFindBankList({}).then(res => {
          console.log(res);
          if (res.code === 'SUCCESS') {
            this.getMap = res.data.bankList
            this.showLoading = false
          } else {
            this.$toast(res.msg)
          }
        })
      },
      // 选择银行卡
      handleChooseBankcard (item) {
        if (item.isMaintain === 1) return false
        let queryObj = {
          bankName: item.bankName,
          bankCode: item.bankCode
        }
        this.$router.push({
          path: '/bindBankCard',
          query: {
            queryObj: JSON.stringify(queryObj),
            routerFrom: this.routerFrom
          }
        })
      }
    }
  }
</script>

<style lang="less">

  .bank-card-type {
    background-color: #fff;
    ul{
      background-color: #fff; padding: 0 0.2rem;
      box-sizing: border-box;
      li{
        &.gray{
          color: #b8b8b8;
          img{
            opacity: 0.3;
          }
        }
        position: relative;
        width: 100%;
        height: 100px;
        line-height: 100px;
        text-align: left;
        border-bottom: 1px solid #E5E5E5;
        box-sizing: border-box;
        .bankcard-icon{
          width: 0.5rem;
          height: 0.5rem;
          position: absolute;
          top: 50%;
          left: 0;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
          border-radius: 0.25rem;
        }
        .bankcard-info{
          margin-left: 0.7rem; font-size: 0.32rem;
          span:first-child{
            margin-right: 0.2rem;
            height: 100%;
          }
          span.repair{
            font-size: 0.28rem; color: #FF6A52;
          }
          span.right{
            float: right; margin-right: 0.12rem;
          }
          .tickIcon{
            width: 0.5rem;
            height: 0.5rem;
            position: absolute;
            top: 50%;
            right: 0.5rem;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
</style>
