<template>
    <div class="container">
        <div class="content">
            <ul class="lists clearfix">
                <li>
                    <span>场次编号：</span>
                    <p>{{data.sceneNum}}</p>
                </li>
                <li>
                    <span>奖品名称：</span>
                    <p>{{data.awardName}}</p>
                </li><li>
                    <span>投注数：</span>
                    <p>{{data.curBetNum}}</p>
                </li><li>
                    <span>投注号码：</span>
                    <p>{{data.noteNums.join(',')}}</p>
                </li>
            </ul>
        </div>
        <router-link :to="{name:'orderDetails',query:{orderNum:data.orderNum }}" class="btn">查看订单</router-link>
        <router-link to="/treasure" class="btn">再去逛逛</router-link>
    </div>
</template>

<script>
    export default {
        name: "bettingResult",
        data(){
            return{
                data:this.$route.query.data?JSON.parse(this.$route.query.data):{}
            }
        },
        beforeCreate(){
            this.$util.setPageHeight100p();
        },
        beforeDestroy(){
            this.$util.recoveryPageHeight();
        }
    }
</script>

<style scoped lang="less">
.container{
    padding-top: 40px;
    background: #5c2dca url("../../../assets/img/treasure/bg2.png") no-repeat;
    background-size: 100%;
    min-height: 100%;
    box-sizing: border-box;
    .content{
        width: 642px;
        border: 8px solid #736FE5;
        border-radius: 4px;
        background: #ffffff;
        margin: 0 auto 56px;
        box-sizing: border-box;
        padding: 28px 58px 20px;
        .lists{
            width: 100%;
            li{
                width: 100%;
                float: left;
                color: #949BA9;
                min-height: 46px;
            }
            span{
                width: 35%;
                float: left;
                margin-bottom: 10px;
                color: #736FE5;
            }
            p{
                float: left;
                width: 65%;
                margin-bottom: 10px;
                word-break:break-word;
            }
        }
    }
    .btn{
        display: block;
        width: 616px;
        height: 104px;
        background: url("../../../assets/img/treasure/btn_large.png") no-repeat;
        background-size: 100%;
        line-height: 98px;
        text-align: center;
        font-size: 32px;
        color: #ffffff;
        margin: 0 auto 28px;
    }

}
</style>