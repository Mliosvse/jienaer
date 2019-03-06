<template>
  <div class="credit-search">
    <div class="search-box">
      <div class="banner">
        <img src="@/assets/img/upCredit/banner.png" alt="">
      </div>
      <div class="search">
        <input
          type="text"
          class="search-input"
          placeholder="请输入贷款平台名称"
          v-model="productName"
        />
      </div>
    </div>
    <jn-button :click="hanldeSearch" class="search-btn">一键查询</jn-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productName: ''
    }
  },
  methods: {
    hanldeSearch() {
      if (!this.productName) {
        return this.$toast('请输入贷款平台名称')
      }
      this.$router.push({
        path: '/creditResult',
        query: {
          platformName: this.productName
        }
      })
    }
  }
}
</script>

<style lang="less">
  .credit-search {
    .search-box {
      position: relative;
      .banner {
        width: 100%;
        img {
          width: 100%;
        }
      }
      .search {
        width: 100%;
        height: 104px;
        box-sizing: border-box;
        padding: 0 30px;
        position: absolute;
        bottom: 0;
        transform: translateY(50%);
        .search-input {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: 1px solid #14ABFA;
          border-radius: 52px;
          background: url('~@/assets/img/upCredit/search.png') no-repeat 40px 50% #fff;
          background-size: 40px;
          padding-left: 106px;
          font-size:32px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          line-height:44px;
        }
      }
    }
    .search-btn {
      margin-top: 150px;
    }
  }
</style>
