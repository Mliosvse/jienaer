<template>
  <div class="jn-button">
    <div
      v-if="disable"
      class="btn-disable"
    ><slot></slot></div>
    <div
      v-else
      :class="type==='bule'?'jn_btn':'jn_btn bg-white'"
      @click="click()"
      @touchstart="handleTouchStart()"
      @touchend="handleTouchEnd()"
      ref="btn"
    ><slot></slot></div>
  </div>
</template>

<script>
  export default {
    name: "jnButton",
    props: {
      type: {
        type: String,
        default: "bule"
      },
      disable: {
        type: Boolean
      },
      click: {
        type: Function
      }
    },
    methods:{
      handleTouchStart(){
        this.$refs.btn.classList.add('start')
      },
      handleTouchEnd(){
        this.$refs.btn.classList.remove('start')
      }
    }
  };
</script>

<style lang="less">
  @import '~@/style/theme.less';
  .jn-button {
    .jn_btn {
      width: 686px;
      height: 88px;
      background: @theme-color;
      color: #fff;
      margin: 0 auto;
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      line-height: 88px;
      border-radius: 44px;
    }
    .bg-white {
      background: #fff;
      color: @theme-color;
      border: 1px solid @theme-color;
    }
    .btn-disable {
      width:686px;
      height:88px;
      background:#ccc;
      border-radius:44px;
      font-size:32px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:#fff;
      line-height:32px;
      text-align: center;
      line-height: 88px;
      margin: 0 auto;
    }
    .start {
      opacity: 0.7;
    }
  }
</style>