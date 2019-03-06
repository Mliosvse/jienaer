<template>
  <div class="select-bank">
    <div class="loading-mask" v-if="showLoding" >
      <van-loading color="white" class="spinner-loading" />
    </div>
    <div v-else>
      <jn-tip>以下为您在优享淘绑定的银行卡，请选择{{routerFrom==='billDetail'?'还款':'放款'}}银行卡</jn-tip>
      <div class="bankList">
        <van-radio-group v-model="radio">
          <van-cell
            v-for="(item, index) in bankList"
            :key="index"
            :title="item.bankName"
            @click="handleSelectItem(item, index)"
            clickable
            center
            :icon="item.bankIcon"
          >
            <van-radio :name="index" />
          </van-cell>
        </van-radio-group>
        <jn-item class="add-card-border" :config="selectConfig" @click.native="handleAddBank">
          <span slot="icon" class="tel"></span>
          <div slot="left">添加银行卡</div>
        </jn-item>
      </div>
      <jn-button v-if="checkedBank.id" :click="handleConfirmBank">确认银行卡信息</jn-button>
      <jn-button v-else :disable="true" :click="handleConfirmBank">确认银行卡信息</jn-button>
    </div>
  </div>
</template>

<script>
  import { apiGetUserBindBankCardList } from '@/api/borrow'
  export default {
    name: "selectBank",
    data() {
      return {
        radio: '',
        showLoding: false,
        //jn-item组件配置参数
        itemConfig: {
          icon: true,
          left: true,
          right: false,
          arrow: false
        },
        selectConfig: {
          icon: true,
          left: true,
          right: false,
          arrow: true
        },
        //银行列表数据
        bankList: [],
        //选中的银行卡
        checkedBank: {},
        routerFrom: ''
      };
    },
    mounted () {
      this.showLoding = true
      console.log(window.location.href);
      this.routerFrom = this.$route.query.routerFrom
      this.handleGetBankList()
    },
    methods: {
      handleGetBankList () {
        let userMobile = localStorage.getItem('userName') || ''
        let params = {
          userMobile: userMobile //用户手机号码
        }
        apiGetUserBindBankCardList(params).then(res => {
          console.log(res);
          if (res.code === 'SUCCESS') {
            this.bankList = res.data.userBankCardList
            localStorage.setItem('realName', res.data.realName)
            localStorage.setItem('idNumber', res.data.idNumber)
            this.showLoding = false
          } else {
            this.$toast(res.msg)
          }
        })
      },
      handleSelectItem (item, index) {
        this.radio = index
        this.checkedBank = item
      },
      handleConfirmBank () {
        this.$router.push({
          path: '/' + this.routerFrom,
          query: {
            bankObj: JSON.stringify({
              bankName: this.checkedBank.bankName,
              id: this.checkedBank.id
            })
          }
        })
      },
      handleAddBank(){
        this.$router.push({
          path: '/bindBankCard',
          query: {
            routerFrom: this.routerFrom
          }
        })
      }
    }
  };
</script>

<style scoped lang="less">
  .bankList {
    margin-bottom: 100px;
    .tel {
      float: left;
      width: 52px;
      height: 52px;
      background: url("~@/assets/img/common/bank.png") no-repeat;
      background-size: 100%;
    }
    .add-card-border {
      border-top: 1px solid #EBEBEB;
    }
  }
</style>