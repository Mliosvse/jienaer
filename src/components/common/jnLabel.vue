<template>
  <div class="jn-label">
    <div :class="type" class="label-box">
      <div class="label">{{name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String
    },
    /**
     * warning
     * primary
     * danger
     */
    type: {
      type: String,
      default: 'primary'
    }
  }
}
</script>

<style lang="less">
  .jn-label {
    .danger {
      background: #F46C4A;
      .label {
        color: #fff;
      }
    }
    .primary {
      background: rgba(61,101,237,.3);
      .label {
        color:#3D65ED;
      }
    }
    .warning {
      background:rgba(236,170,37,0.1);
      .label {
        color: #ECAA25;
      }
    }
    .label-box {
      margin-right: 12px;
      height:30px;
      display: inline-block;
      font-family:PingFangSC-Regular;
      border-radius: 5px;
      text-align: center;
      transform: skew(-20deg);
      .label {
        font-size:20px;
        transform: skew(20deg);
        line-height:30px;
        padding: 0 16px;
      }
    }
  }
</style>
