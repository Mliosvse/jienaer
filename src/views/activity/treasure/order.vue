<template>
    <div class="container" v-infinite-scroll="getList" infinite-scroll-disabled="busy" infinite-scroll-distance="2">
        <div v-show="orderList.length" class="item" v-for="(item,index) in orderList" :key="index" @click="goLink(item.orderNum)">
            <ul>
                <li><p>用户ID</p><p>{{userName}}</p></li>
                <li><p>奖品名称</p><p>{{item.awardName}}</p></li>
                <li><p>投注号</p><p>{{item.noteNum}}</p></li>
                <li><p>投注时间</p><p>{{item.addTime}}</p></li>
                <li><p>场次编号</p><p>{{item.sceneNum}}</p></li>
                <li><p>状态</p><p>{{item.isAward===0?'待开奖':'已开奖'}}</p></li>
                <li v-show="item.isAward"><p>开奖结果</p><p>{{item.awardRes===0?'未中奖':'中奖'}}</p></li>
                <li v-show="item.isAward"><p>中奖号码</p><p>{{item.awardNum}}</p></li>
            </ul>
            <div :class="item.isAward===0?'state':'state wait'">{{item.isAward===0?'待开奖':'已开奖'}}</div>
        </div>
        <img v-show="!orderList.length" class="nodata" src="../../../assets/img/treasure/alert_norder.png" alt="">
    </div>
</template>

<script>
    import infiniteScroll from 'vue-infinite-scroll'
    export default {
        name: "order",
        directives: {infiniteScroll},
        data(){
          return {
              busy: false,
              orderList:[],
              currentPage:0,
              pageSize:6,
              totalPage:1,
              userName:JSON.parse(sessionStorage.appInfo).userName
          }
        },
        methods:{
            getList(){
                if(this.currentPage==this.totalPage){
                    return;
                }
                this.currentPage++;
                let postData ={
                    userName: this.userName,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }
                this.$myHttp.formPost('/activity_indiana/queryAllPersionOrder',postData,1).then(res=>{
                    if(res.result.code==='1000'){
                        const alls = res.result.data.alls||[];
                        this.orderList = this.orderList.concat(alls);
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                });
            },
            goLink(orderNum){
                this.$router.push({path:'/orderDetails', query:{orderNum} });
            }
        },
        mounted(){
            this.getList();
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
        padding-bottom: 158px;
        .nodata{
            width: 642px;
            margin: 0 auto;
            display: block;
        }
        .item{
            width: 642px;
            background: #ffffff;
            border: 8px solid #9298f6;
            box-sizing: border-box;
            margin: 0 auto 40px;
            ul{
                padding: 28px 58px;
                box-sizing: border-box;
                li{
                    width: 100%;
                    min-height: 50px;
                    font-size: 28px;
                    display: flex;
                    justify-content: space-between;
                }
                p:first-of-type{
                    width: 158px;
                    color: #736FE5;
                }
                p:last-of-type{
                    width: 360px;
                    margin-left: 40px;
                    color: #949BA9;
                    margin-bottom: 10px;
                    word-break: break-word;
                }
            }
            .state{
                background: #9298f6;
                line-height: 100px;
                text-align: center;
                font-size: 40px;
                color: #ffffff;
            }
            .wait{
                background: #e5e7fc;
                color: #9298f6;
            }
        }
    }
</style>