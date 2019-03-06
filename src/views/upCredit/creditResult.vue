<template>
  <div class="credit-result">
    <div class="loading-mask" v-if="showLoding" >
      <van-loading color="white" class="spinner-loading" />
    </div>
    <div class="loading" v-else-if="isShowLoading">
      <img src="@/assets/img/upCredit/searchIn.png" alt="">
      <div class="title">系统正在查询中…</div>
      <div class="tips">正在努力查询中 请耐心等待哦</div>
    </div>
    <div class="result-box" v-else>
      <div class="img-box" ref="imgBox">
        <img :src="logo" alt="" ref="img">
      </div>
      <div class="title">{{platformName}}</div>
      <div class="tips2">{{isCredit}} </div>
      <jn-button :click="hanldeSearch">继续查询</jn-button>
      <div class="tips">
        <span>· 查询结果仅供参考，以平台官方信息为准 ·</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showLoding: true,
      isShowLoading: true,
      platformName: '',
      logo: require('@/assets/img/upCredit/default.png'),
      isCredit: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.showLoding = false
      setTimeout(() => {
        this.isShowLoading = false
      }, 2000);
      this.handleLog()
      this.handleData()
    })
  },
  methods: {
    hanldeSearch () {
      this.$router.go(-1)
    },
    handleLog() {
      this.$myHttp.get('/creditInfo/addCreditLog',{})
    },
    handleData() {
      let platformName = this.$route.query.platformName || ''
      let postData = {
        platformName: platformName
      }
      this.$myHttp.jsonPostHeaderUser('/creditInfo/findByName',postData).then((res) => {
        if(res.result.code==="1000"){
          if(!res.result.data) {
            this.platformName = platformName
            this.isCredit = '货款时不上征信'
          } else {
            this.platformName = res.result.data.platformName
            this.logo = res.result.data.logo
            this.isCredit = res.result.data.isCredit ? '货款时上征信' : '货款时不上征信'
          }
        } else {
          this.$util.Toast({message:res.result.msg});
        }
      })
    }
  }
}
</script>

<style lang="less">
  .credit-result {
    background: #fff;
    height: 100%;
    .loading {
      text-align: center;
      img {
        width: 244px;
        height: 244px;
        margin: 116px 0 60px;
      }
      .title {
        font-size:44px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:60px;
      }
      .tips {
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:40px;
      }
    }
    .result-box {
      padding-top: 120px;
      text-align: center;
      .img-box {
        width: 180px;
        height: 180px;
        overflow: hidden;
        margin: 0 auto 44px;
        img {
          width: 100%;
        }
      }
      .title {
        font-size:36px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:50px;
      }
      .tips2 {
        font-size:30px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:42px;
        padding-bottom: 70px;
      }
      .tips {
        width: 100%;
        position: absolute;
        bottom: 50px;
        font-size:24px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        text-align: center;
      }
    }
  }
</style>
