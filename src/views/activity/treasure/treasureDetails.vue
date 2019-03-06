<template>
    <div class="container" v-infinite-scroll="getListByPage" infinite-scroll-disabled="busy" infinite-scroll-distance="2">
        <div class="banner">
            <img src="../../../assets/img/treasure/detailBanner.png" alt="">
        </div>
        <div class="datalist">
            <p class="dl_left">场次编号: {{actProd.sceneNum}}</p>
            <p class="dl_right">奖品价值: {{actProd.awardWorth}}</p>
            <p class="dl_left">总注数: {{actProd.totalNote}}</p>
            <p class="dl_right">已投注: {{actProd.castNote}}</p>
        </div>
        <ul class="menuTab">
            <li @click="active='introduce'" :class="active==='introduce'?'active':''">规则介绍</li>
            <li @click="active='record'" :class="active==='record'?'active':''">投注记录</li>
            <li @click="active='history'" :class="active==='history'?'active':''">历史开奖</li>
        </ul>
        <div v-show="active==='introduce'" class="introduce">
            <p class="tip">中奖用户请添加官方客服微信号jienaer001领取奖品</p>
            <div class="ruleTitle">一、投注号码生成规则</div>
            <p class="ruleList">1、用户通过金币可以进行下注，每购买一注，则可以随机获得一个八位数的投注号码，如果总注数为N，则号码的范围是取值范围为10000001到10000000+N之间，共N个。</p>
            <p class="ruleList">2、该场次全部投注号分配完毕后开始抽奖。</p>
            <div class="ruleTitle">二、中奖规则</div>
            <p class="ruleList">1、取该场次最后投注时间点之前全站所有场次最后10条投注记录下单时间，精确到毫秒，按时分秒毫秒排列组合成10个9位数字。 将10个9位数字相加，得出求和。</p>
            <p class="ruleList">2、将所得之和除以该场次的总注数，取计算结果的余数，加上10000001，为最后的结果。</p>
            <p class="ruleList">3、举例子，如果一个时间点为2018年12月29日09点09分13秒310毫秒，则取值为90913310，该场次总注数为5，除以5后余数为0，则0＋10000001＝10000001，最后中奖号码为10000001。</p>
        </div>
        <div v-show="active==='record'" class="record">
            <ul>
                <li class="list_title">
                    <div>用户ID</div>
                    <div>投注时间</div>
                    <div>投注号码</div>
                </li>
                <li class="list_content" v-for="(item,index) in listBet" :key="index">
                    <p>{{item.userName}}</p>
                    <p class="time">{{item.addTime}}</p>
                    <p>{{item.noteNum}}</p>
                </li>
                <li class="noData" v-show="!listBet.length">
                    <img src="../../../assets/img/treasure/nodata.png" alt="">
                    <p>暂无开奖记录</p>
                </li>
            </ul>
        </div>
        <div v-show="active==='history'" class="history">
            <ul>
                <li class="list_title">
                    <div>场次编号</div>
                    <div>中奖用户</div>
                    <div>中奖号码</div>
                </li>
                <li class="list_content" v-for="(item,index) in recordLists" :key="index">
                    <p>{{item.sceneNum}}</p>
                    <p>{{item.userName}}</p>
                    <p>{{item.awardNum}}</p>
                </li>
                <li class="noData" v-show="!recordLists.length">
                    <img src="../../../assets/img/treasure/nodata.png" alt="">
                    <p>暂无开奖记录</p>
                </li>
            </ul>
            <div v-show="recordLists.length>6" class="scroll_loadingTip">没有更多了</div>
        </div>
        <div class="tz_btn" @click="alert=true;">
            <div>投注赢大奖</div>
        </div>
        <div class="alert_tz" v-show="alert||alert_noCoin">
            <div class="tz_box" v-show="alert">
                <div class="alert_top">
                    <p>本场编号:{{actProd.sceneNum}}</p>
                    <p>奖品价值:{{actProd.awardWorth}}</p>
                    <p>总注数：{{actProd.totalNote}}</p>
                    <p>已投注：{{actProd.castNote}}</p>
                </div>
                <div class="alert_mid">
                    <div>剩余可投：{{(actProd.totalNote - actProd.castNote)}}</div>
                    <div>我要投注：{{curBetNum}}  <span>每人每场最高投{{actProd.totalNote===5?5:10}}个</span><i @click="addCoin" class="plus"></i><i @click="minusCoin" class="minus"></i></div>
                    <div>可用金币：{{userCoin}} <span>1幸运币可投注1次</span></div>
                </div>
                <div class="alert_btn" @click="betCoin">投币赢大奖</div>
                <span class="close" @click="alert = false;"></span>
            </div>
            <div class="noCoin" v-show="alert_noCoin">
                <router-link to="/goldCoin" class="alert_btn btn_nodata">我要领取</router-link>
                <span class="close" @click="alert_noCoin = false;"></span>
            </div>
        </div>
    </div>
</template>

<script>
    import infiniteScroll from 'vue-infinite-scroll'
    export default {
        name: "treasureDetails",
        directives: {infiniteScroll},
        data() {
            return {
                alert:false,
                alert_noCoin:false,
                busy: false,
                active: 'introduce',
                id:this.$route.query.id,
                actProd:{},           //场次信息
                listBet: [],       //投注记录
                userCoin: '',   //用户剩余金币
                curBetNum: 1,   //用户当前投注注数
                currentPage: 1,   //当前页数
                pageSize: 8,        //每页条数
                totalPage: 1,        //总页数
                recordLists: [],   //开奖记录
                isPending:false,   //是否正在请求
            }
        },
        beforeCreate() {
            document.querySelector('html').style.background = '#fff';
        },
        beforeDestroy() {
            document.querySelector('html').style.background = '';
        },
        methods: {
            getData(){
                let postData = {
                    id:this.id,
                    currentPage:1,
                    pageSize:8,
                    appInfo:sessionStorage.appInfo,
                }
                this.$myHttp.formPost('/activity/prodDetails',postData,1).then(res=>{
                    if(res.result.code==='1000'){
                        this.actProd = res.result.data.actProd;
                        this.listBet = res.result.data.listBet;
                        this.recordLists = res.result.data.listWin;
                        this.userCoin = res.result.data.userCoin;
                        this.totalPage = res.result.data.totalPage;
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                })
            },
            //分页获取投资记录
            getListByPage(){
                if(this.active!=='record'||this.totalPage===this.currentPage){
                    return;
                }
                let postData = {
                    id:this.id,
                    currentPage:++this.currentPage,
                    pageSize:this.pageSize,
                    appInfo:sessionStorage.appInfo,
                }
                this.$myHttp.formPost('/activity/prodDetails',postData).then(res=>{
                    if(res.result.code==='1000'){
                        this.listBet = this.listBet.concat(res.result.data.listBet);
                        this.totalPage = res.result.data.totalPage;
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                })
            },
            //加注
            addCoin(){
                if(this.curBetNum>=this.userCoin||this.curBetNum===10||(this.actProd.totalNote - this.actProd.castNote)===this.curBetNum){
                    return
                }
                this.curBetNum++;
            },
            //减注
            minusCoin(){
                if(this.curBetNum===1){
                    return
                }
                this.curBetNum--;
            },
            //投注
            betCoin(){
                if(this.curBetNum>this.userCoin){
                    this.alert = false;
                    this.alert_noCoin = true;
                    return;
                }
                if(this.isPending){
                    return
                }
                this.isPending = true;
                let postData = {
                  id:this.id,
                  curBetNum: this.curBetNum,
                  appInfo: sessionStorage.appInfo
                };
                this.$myHttp.formPost('/activity/duobaoBet',postData,2).then(res=>{
                    this.alert = false;
                    this.isPending = false;
                    this.curBetNum = 1;
                    if(res.result.code==='1000'){
                        const data = JSON.stringify(res.result.data);
                        this.$router.push({path:'/bettingResult', query:{data} });
                    }else if(res.result.code==='-1'){
                        this.alert_noCoin = true;
                    }else if (res.result.code == '-2') {
                        this.$util.Toast({message: res.result.msg});
                        this.getData();
                    }else {
                        this.$util.Toast({message: res.result.msg});
                    }
                })
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped lang="less">
    @import "../../../style/activity/treasure/list";
    .container {
        .banner {
            img {
                display: block;
                width: 100%;
            }
        }
        .datalist {
            width: 100%;
            padding: 34px 32px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            font-size: 32px;
            color: #333;
            box-sizing: border-box;
            background: #ffffff;
            p {
                margin-bottom: 10px;
            }
            .dl_left {
                width: 62%;
            }
            .dl_right {
                width: 38%;
            }
        }
        .menuTab {
            display: flex;
            justify-content: start;
            background: #ffffff;
            li {
                flex: 1;
                line-height: 90px;
                font-size: 30px;
                text-align: center;
                border-bottom: 1px solid #E8EAEF;
                color: #949BA9;
            }
            .active {
                color: #736FE5;
                border-bottom: 4px solid #736FE5;
            }
        }
        .introduce {
            background: #ffffff;
            padding: 0 32px 172px;
            box-sizing: border-box;
            .tip{
                color: #333;
                font-size: 30px;
                padding: 36px 0 16px 0;
            }
            .ruleTitle{
                color: #736FE5;
                font-size: 32px;
                margin-bottom: 14px;
                margin-top: 20px;
            }
            .ruleList{
                color: #949BA9;
                font-size: 28px;
                line-height: 44px;
            }
        }
        .record {
            background: #ffffff;
            padding-bottom: 150px;
        }
        .history {
            background: #ffffff;
            padding-bottom: 150px;
        }
        .noData{
            img{
                display: block;
                margin: 40px auto 20px;
                width: 400px;
            }
            p{
                text-align: center;
                color: #ccc;
                font-size: 28px;
            }
        }
        .tz_btn{
            height: 150px;
            /*background: #ffffff;*/
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            div{
                width: 616px;
                height: 104px;
                background: url("../../../assets/img/treasure/btn_large.png") no-repeat;
                background-size: 100%;
                margin: 0 auto;
                text-align: center;
                color: #ffffff;
                font-size: 32px;
                line-height: 98px;
            }
        }
        .alert_tz{
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            background: rgba(0,0,0,.5) no-repeat;
            background-size: 100%;
            .tz_box{
                width: 642px;
                height: 574px;
                margin: 300px auto 0px;
                background: url("../../../assets/img/treasure/alert_tz.png") no-repeat;
                background-size: 100%;
                padding: 70px 40px 0;
                box-sizing: border-box;
                position: relative;
                .alert_top{
                    color: #736FE5;
                    font-size: 28px;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    p{
                        width: 62%;
                        line-height: 40px;
                        margin-bottom: 8px;
                    }
                    p:nth-of-type(2n){
                        width: 38%;
                    }
                }
                .alert_mid{
                    margin-top: 72px;
                    div{
                        font-size: 28px;
                        color: #333;
                        margin-bottom: 12px;
                        span{
                            color: #949BA9;
                            float: right;
                        }
                        i{
                            float: right;
                            width: 44px;
                            height: 44px;
                            margin-right: 16px;
                        }
                        .minus{
                            background: url("../../../assets/img/treasure/minus.png") no-repeat;
                            background-size: 100%;
                        }
                        .plus{
                            background: url("../../../assets/img/treasure/plus.png") no-repeat;
                            background-size: 100%;
                        }
                    }
                }
            }
            .alert_btn{
                width: 536px;
                height: 104px;
                background: url("../../../assets/img/treasure/btn_alert.png") no-repeat;
                background-size: 100%;
                margin: 62px auto 0;
                line-height: 98px;
                text-align: center;
                font-size: 32px;
                color: #ffffff;
            }
            .noCoin{
                width: 642px;
                height: 822px;
                margin: 100px auto 0px;
                background: url("../../../assets/img/treasure/noCoin.png") no-repeat;
                background-size: 100%;
                position: relative;
            }
            .btn_nodata{
                display: block;
                position: absolute;
                left: 54px;
                bottom: 62px;
            }
            .close{
                display: block;
                position: absolute;
                width: 108px;
                height: 108px;
                left: 50%;
                margin-left: -54px;
                bottom: -130px;
                background: url("../../../assets/img/treasure/close.png") no-repeat;
                background-size: 100%;
            }
        }
    }
</style>