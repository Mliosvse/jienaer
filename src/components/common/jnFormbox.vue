<template>
    <div class="formItem" :class="icon">
        <div class="name" v-text="name"></div>
        <span v-if="icon && iconClick" :class="icon" @click="iconClick()"></span>
        <span v-if="icon && !iconClick" :class="icon"></span>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "jnSelectbox",
        props:{
            name:{
                type:String,
                required:true
            },
            icon:{
                type: String,
                default:''
            },
            iconClick: {
                type: Function
            }
        }
    }
</script>

<style scoped lang="less">
    .formItem {
        width: 100%;
        height: 100px;
        background: #ffffff;
        position: relative;
        padding-left: 34px;
        border-bottom: 1px solid #EBEBEB;
        box-sizing: border-box;
        .name {
            float: left;
            font-size: 30px;
            line-height: 100px;
        }
        select{
            float: right;
            width: 380px;
            height: 100px;
            text-align: right;
            font-size: 30px;
            color: #333;
        }
        input{
            float: right;
            width:390px;
            height: 100px;
            padding-right: 20px;
            box-sizing: border-box;
            text-align: right;
            font-size: 30px;
            color: #333;
        }
        .tel{
            float: right;
            background: url("../../assets/img/common/tel_icon.png") no-repeat;
            background-size: 100%;
            width: 36px;
            height: 52px;
            margin-top:32px;
            margin-right: 32px;
        }
        .select{
            float: right;
            background: url("../../assets/img/common/right_arrow.png") no-repeat;
            background-size: 100%;
            width: 24px;
            height: 42px;
            margin-top: 28px;
            margin-right: 32px;
        }
    }
</style>