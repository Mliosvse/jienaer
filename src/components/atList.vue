<template>
  <div :class="isLink?'atList isLink':'atList'">
    <div class="title">{{title}}</div>
    <div v-if="state==='已认证'" class="state gray">{{state}}</div>
    <div v-if="state==='待认证'||state==='认证过期'" class="state">{{state}}</div>
    <div v-if="state!=='待认证'&&state!=='已认证'" class="state wait">{{state}}</div>
  </div>
</template>

<script>
  export default {
    name: "atList",
    props: {
      title: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      isLink: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {};
    },
    methods: {}
  };
</script>

<style scoped lang="less">
  @import '~@/style/theme.less';
  .atList {
    width: 100%;
    height: 100px;
    line-height: 100px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    padding-left: 32px;
    padding-right: 70px;
    box-sizing: border-box;
    border-bottom: 1px solid #e8e8e8;
    position: relative;
    .title {
      color: #333;
      font-size: 30px;
    }
    .state {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 66px;
      top: 50%;
      transform: translateY(-50%);
      width: 96px;
      height: 36px;
      border-radius: 18px;
      border: 1px solid @theme-color;
      font-size: 20px;
      color: @theme-color;
    }
    .state.gray {
      background: #fff;
      border: 1px solid #ccc;
      color: #ccc;
    }
    .state.wait {
      background: @theme-color;
      color: #fff;
    }
  }
  .isLink:after {
    content: "";
    position: absolute;
    top: 30px;
    right: 32px;
    width: 24px;
    height: 42px;
    background: url("../assets/img/common/right_arrow.png") no-repeat;
    background-size: 100%;
  }
</style>