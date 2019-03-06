<template>
  <div class="my-address">
    <ul v-if="addressList.length">
      <li
        v-for="(item, index) in addressList"
        :key="index"
      >
        <div class="info" @click="handleAddress(item)">
          <span class="name">{{item.receiverName}}</span>
          <span class="tel">{{item.receiverMobile}}</span>
          <div class="address">{{item.detailAddress}}</div>
        </div>
        <div class="edit" @click="handleEditAddress(item)">编辑</div>
      </li>
    </ul>
    <jn-button class="addAddress" :click="handleEditAddress">添加新地址</jn-button>
  </div>
</template>

<script>
import {apiFindList} from '@/api/borrow'
export default {
  data () {
    return {
      addressList: []
    }
  },
  mounted(){
    // 获取收货地址
    this.handleGetAddressList()
  },
  methods: {
    handleGetAddressList () {
      apiFindList({}).then(res=>{
        if (res.result.code === "1000") {
          this.addressList = res.result.data.address
          this.addressList.map(item=>{
            let province = item.province === item.city ? '' : item.province
            item['detailAddress'] = province + item.city +item.region+item.address
          })
        } else {
          this.$toast(res.result.msg)
        }
      })
    },
    handleAddress (item) {
      this.$router.push({
        path: '/signBorrow',
        query: {
          goods: this.$route.query.goods,
          address: JSON.stringify(item)
        }
      })
    },
    handleEditAddress(item) {
      this.$router.push({path: '/editAddress',query:{
        address:JSON.stringify(item),
        goods: this.$route.query.goods}});
    }
  }
}
</script>

<style lang="less">
  .my-address {
    ul {
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 32px;
        margin-top: 16px;
        background: #fff;
        .info {
          flex: 1;
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
        .edit {
          width:64px;
          height: 100%;
          font-size:32px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(245,104,52,1);
          line-height:44px;
          padding-left: 32px;
          border-left: 1px solid #EBEBEB;
        }
      }
    }
    .addAddress{
      margin-top: 80px;
    }
  }
</style>
