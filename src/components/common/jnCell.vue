<template>
  <div class="jn-cell">
    <div class="info">
      <div class="info-title" v-if="type==='title'">{{this.name}}</div>
      <div class="info-tip" v-if="type==='tip'">{{this.name}}</div>
      <div class="info-default" v-if="type==='default'">{{this.name}}</div>
      <div class='info-value'>{{this.value}}</div>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * type: {
   *  tip: '提示'
   *  title: '标题'
   * }
   */
  props: {
    name: {
      type: String
    },
    value: {
      type: String
    },
    icon: {
      type: Boolean
    },
    type: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style lang="less">
  .jn-cell {
    padding: 0 32px;
    background: #fff;
    border-bottom: 1px solid #EBEBEB;
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 0;
      .info-value {
        font-size:30px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#333;
        line-height: 30px;
      }
      .info-default {
        font-size:30px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#333;
      }
      .info-tip {
        font-size:30px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color: #999;
      }
      .info-title {
        font-size:32px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:#23262F;
        line-height:44px;
      }
    }
    .icon {
      width: 15px;
      height: 30px;
      line-height: 30px;
      display: inline-block;
      background: url("~@/assets/img/common/right_arrow.png") no-repeat center right;
      background-size: cover;
    }
  }
</style>
