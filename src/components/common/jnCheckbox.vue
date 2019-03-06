<template>
  <div class="jn-checkbox">
    <div :class="isCheck?'circle circle_true':'circle'" @click="handleClick()">
    </div>
    <slot></slot>
  </div>
</template>

<script>
    export default {
      name: "jnCheckbox",
      props:{
        isCheck:{
          type:Boolean,
          default:false
        },
        handleClick: {
          type: Function
        }
      }
    }
</script>

<style scoped lang="less">
  .jn-checkbox {
    .circle{
      width: 52px;
      height: 52px;
      background: url('~@/assets/img/smallLoan/check_box_false.png') no-repeat;
      background-size: contain;
    }
    .circle_true{
      background: url('~@/assets/img/smallLoan/check_box_true.png') no-repeat;
      background-size: contain;
    }
  }
</style>