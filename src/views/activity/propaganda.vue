<template>
    <div class="container">
        <img src="../../assets/img/activitybg.png" alt="">
        <div class="ruleTab" @click="isShow=true"></div>
        <div v-show="isShow" class="dialong">
            <div class="rule">
                <img @click="isShow=false" class="rule_close" src="../../assets/img/close_btn.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "propaganda",
        data(){
            return{
                isShow:false,
            }
        },
    }
</script>

<style scoped lang="less">
    .container{
        background:#0576b1;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        img{
            display: block;
            width: 100%;
        }
        .ruleTab{
            position: fixed;
            right: 0;
            bottom: 80px;
            width: 182px;
            height: 68px;
            background: url("../../assets/img/activity1_rule.png") no-repeat;
            background-size: 100% auto;
        }
        .dialong{
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            .rule{
                width: 562px;
                height: 760px;
                margin: 200px auto 0;
                background: url("../../assets/img/activity_rule.png");
                background-size: 100%;
                position: relative;
                .rule_close{
                    width: 80px;
                    height: 80px;
                    position: absolute;
                    bottom: -110px;
                    left: 50%;
                    margin-left: -40px;
                }
            }
        }

    }
</style>