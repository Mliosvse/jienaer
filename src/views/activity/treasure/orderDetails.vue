<template>
    <div class="container">
        <ul class="details clearfix">
            <li><span>奖品名称:</span><p>{{owmDetails.awardName}}</p></li>
            <li><span>投注时间:</span><p>{{owmDetails.addTime}}</p></li>
            <li><span>投注号码:</span><p>{{owmDetails.noteNum}}</p></li>
            <li><span>场次编号:</span><p>{{owmDetails.sceneNum}}</p></li>
            <li><span>订单状态:</span><p>{{owmDetails.isAward?'已开奖':'待开奖'}}</p></li>
            <li v-show="owmDetails.isAward"><span>订单结果:</span><p>{{owmDetails.awardRes?'中奖':'未中奖'}}</p></li>
            <li v-show="owmDetails.isAward"><span class="red">中奖号码:</span><p class="red">{{owmDetails.awardNum}}</p></li>
        </ul>
        <div class="process" v-show="!owmDetails.isAward">
            <h3>当前投注人数</h3>
            <div class="process_out">
                <div class="process_in" :style="{ width: progress + '%' }"><span :style="{left: (progress-4)+'%'}">{{progress+'%'}}</span></div>
            </div>
            <div class="info">
                <p>已投注:{{owmDetails.castNote}}</p>
                <p>剩余投注:{{owmDetails.totalNote-owmDetails.castNote}}</p>
            </div>
        </div>
        <div class="numberSource" v-show="owmDetails.isAward">
            <h3 style="margin-left: 20px;">幸运号来源</h3>
            <div class="ns_top">
                <img src="../../../assets/img/treasure/formula.png" alt="">
                <p>余数 {{owmDetails.awardNum-10000001}} ＋ 10000001 ＝ {{owmDetails.awardNum}} (中奖号)</p>
            </div>
            <div class="ns_mid">开奖之前全场最后十位下单时间表  总和{{totalSum}}</div>
            <ul class="time_table" :class="{heightAuto:isOpne}">
                <li class="tb_title"><div>投注时间</div><div>用户ID</div><div>投注场</div><div>整合的数</div></li>
                <li class="tb_list" v-for="(item,index) in preTenList" :key="index">
                    <div class="time">{{item.addTime}}</div>
                    <div>{{item.userName}}</div>
                    <div>{{item.prodName}}</div>
                    <div>{{item.mergeNum}}</div>
                </li>
            </ul>
            <div class="ns_bottom" @click="isOpne=!isOpne">
                <span :class="{open:isOpne}"></span>
            </div>
        </div>
        <ul>
            <li class="list_title">
                <div>投注用户</div>
                <div>投注时间</div>
                <div>投注号码</div>
            </li>
            <li class="list_content" v-for="(item,index) in recordLists" :key="index">
                <p>{{item.userName}}</p>
                <p class="lh50">{{item.addTime}}</p>
                <p class="ellipsis">{{item.noteNum}}</p>
            </li>
        </ul>
        <div class="loadMore" @click="getData">{{loadingTxt}}</div>
    </div>
</template>

<script>
    export default {
        name: "orderDetails",
        data(){
            return{
                isOpne:false,
                userName:JSON.parse(sessionStorage.appInfo).userName,
                preTenList:[],
                recordLists:[],
                owmDetails:{},
                progress:0,
                totalSum:0,
                loadingTxt:'查看更多',
                currentPage:0,
                pageSize: 8,
                totalPage:1,
            }
        },
        beforeCreate () {
            document.querySelector('html').style.background='#fff';
        },
        beforeDestroy () {
            document.querySelector('html').style.background='';
        },
        methods:{
            getData(type){
                if(this.currentPage===this.totalPage){
                    this.loadingTxt = '没有更多了';
                    return
                }
                this.currentPage++;
                let postData = {
                    currentPage:this.currentPage,
                    pageSize:this.pageSize,
                    userName:this.userName,
                    orderNum:this.$route.query.orderNum,
                }
                this.$myHttp.formPost('/activity_indiana/queryIndianaOrderDetails',postData,type).then(res=>{
                    if(res.result.code==='1000'){
                        this.totalPage = res.result.data.totalPage;
                        if(this.currentPage===this.totalPage){
                            this.loadingTxt = '没有更多了';
                        }
                        const other = res.result.data.others||[];
                        this.recordLists = this.recordLists.concat(other);
                        this.owmDetails = res.result.data.owmDetails;
                        this.preTenList = res.result.data.listUser;
                        this.totalSum = res.result.data.totalSum;
                        const progress = Math.ceil(this.owmDetails.castNote/this.owmDetails.totalNote*100);
                        this.progress = progress;
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                })
            },
        },
        mounted(){
            this.getData(1);
        }
    }
</script>

<style scoped lang="less">
    @import "../../../style/activity/treasure/list";
    .container{
        background: #ffffff;
        .details{
            padding: 28px 32px;
            margin-bottom: 50px;
            box-sizing: border-box;
            li{
                width: 100%;
                float: left;
                min-height: 54px;
                line-height: 54px;
                font-size: 32px;
            }
            .red{
                color: #E84946;
            }
            span{
                float: left;
                width: 200px;
                color: #736FE5;
            }
            p{
                float: left;
                width: 420px;
                word-break: break-word;
                margin-left: 40px;
                color: #949BA9;
            }
        }
        h3{
            line-height: 44px;
            font-size: 32px;
            color: #333;
            padding-left: 20px;
            position: relative;
        }
        h3:after{
            content: '';
            display: block;
            width: 8px;
            height: 40px;
            position: absolute;
            left: 0;
            top: 0;
            background: #736FE5;
        }
        .process{
            padding: 0px 32px;
            margin-bottom: 40px;
            .process_out{
                width: 640px;
                height: 20px;
                margin: 40px auto;
                background: #E5E7FC;
                border-radius: 10px;
                position: relative;
                .process_in{
                    background: #736FE5;
                    border-radius: 10px;
                    height: 20px;
                    span{
                        position: absolute;
                        top: 20px;
                        color: #736FE5;
                    }
                }
            }
            .info{
                width: 640px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                p{
                    color: #736FE5;
                    line-height: 40px;
                    font-size: 28px;
                }
            }
        }
        .numberSource{
            .ns_top{
                padding-top: 24px;
                box-sizing: border-box;
                margin-top: 24px;
                background: #736FE5;
                height: 182px;
                img{
                    width: 678px;
                    display: block;
                    margin: 0 auto;
                }
                p{
                    margin-top: 10px;
                    line-height: 56px;
                    text-align: center;
                    color: #ffffff;
                }
            }
            .ns_mid{
                line-height: 70px;
                background: #ffffff;
                color: #736FE5;
                font-size: 28px;
                text-align: center;
            }
            .time_table{
                height: 235px;
                overflow: hidden;
                /*transition: height 0.3s;*/
                li{
                    color: #736FE5;
                    height: 81px;
                    display: flex;
                    justify-content: start;
                    border-bottom: 1px solid #736FE5;
                    div{
                        flex: 1;
                        border-right: 1px solid #736FE5;
                        text-align: center;
                        line-height: 80px;
                    }
                    .time{
                        line-height: 28px;
                        padding-top: 10px;
                        box-sizing: border-box;
                    }
                    div:last-of-type{
                        border: none;
                    }
                }
                .tb_title{
                    background: #E5E7FC;
                }
                .tb_list{
                    background: #ffffff;
                    div{
                        flex: 1;
                        text-align: center;
                    }
                }
                .tb_list:nth-of-type(2n){
                    color: #949BA9;
                }
            }
            .heightAuto{
                /*height: 891px;*/
                height: auto;
                overflow: auto;
            }
            .ns_bottom{
                height: 50px;
                background: #736FE5;
                position: relative;
                span{
                    position: absolute;
                    width: 42px;
                    height: 24px;
                    left: 50%;
                    top: 12px;
                    background: url("../../../assets/img/treasure/arrowDown.png") no-repeat;
                    background-size: 100%;
                }
                .open{
                    transform: rotate(180deg);
                }
            }
        }
        .lh50{
            line-height: 50px;
        }
        .loadMore{
            color: #736FE5;
            font-size: 32px;
            text-align: center;
            line-height: 120px;
        }
    }
</style>