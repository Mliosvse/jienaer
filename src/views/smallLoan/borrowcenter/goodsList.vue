<template>
  <div class="goods-list">
    <ul>
      <li class="clearfix" v-for="(item, index) in goodsList" :key="index">
        <div class="img-box">
          <img :src="item.img" alt="">
        </div>
        <div class="goods-info clearfix">
          <div class="goods-title">{{item.title}}</div>
          <div class="goods-amount">￥{{amount}}元</div>
          <div class="goods-addbtn" @click="handleAddGoods(item)">添加</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data(){
    return {
      goodsList: [
        {
          img: require('@/assets/img/smallLoan/bracelet.png'),
          title: '鸡翅木手串 1.5cm'
        }
      ],
      amount: ''
    }
  },
  mounted () {
    this.amount = this.$route.query.amount || 30
  },
  methods: {
    handleAddGoods (item) {
      this.$router.push({
        path: '/signBorrow',
        query:{
          address: this.$route.address,
          goods: JSON.stringify(item)
        }
      })
    }
  }
}
</script>

<style lang="less">
  .goods-list {
    ul {
      li {
        padding: 40px 32px;
        margin-top: 18px;
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
            color:#4a4a4a;
            float: left;
          }
          .goods-addbtn {
            width: 140px;
            height: 60px;
            border-radius:8px;
            background: #F56834;
            font-size:28px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#fff;
            line-height:60px;
            text-align: center;
            float: right;
          }
        }
      }
    }
  }
</style>
