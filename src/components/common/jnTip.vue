<template>
    <div class="tip"><slot></slot></div>
</template>

<script>
    export default {
        name: "jnTip"
    }
</script>

<style scoped lang="less">
    .tip{
        width: 100%;
        height: 52px;
        background: #ffffff;
        padding-left: 68px;
        line-height: 52px;
        box-sizing: border-box;
        color: #999999;
        margin-bottom: 16px;
    }
    .tip:before{
        content: '';
        position: absolute;
        width: 24px;
        height: 24px;
        background: url("../../assets/img/common/bell.png") no-repeat;
        background-size: 100%;
        top: 14px;
        left:32px;
    }
</style>