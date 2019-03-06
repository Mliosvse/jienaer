<template>
    <div class="container">
        <div class="rule" @click="alert = true;">活动规则</div>
        <div class="loop_user">
            <swiper :options="swiperOption" ref="mySwiper" class="some-swiper" v-if='listUser.length'>
                <!-- 这部分放你要渲染的那些内容 -->
                <swiper-slide :key="index" v-for="(item,index) in listUser">
                    <p>id{{item.userName}}在{{item.prodName}}下注{{item.totalNote}}金币</p>
                </swiper-slide>
            </swiper>
        </div>
        <ul class="list_box">
            <li class="list" @click="goLink(clfm.id)">
                <div class="left">
                    <img src="../../../assets/img/treasure/money.png" alt="">
                    <div class="tag">
                        <span>奖品 5元红包</span>
                    </div>
                </div>
                <div class="right">
                    <h3>{{clfm.senceType}}</h3>
                    <div class="detail">
                        <p>本场编号 :</p>
                        <p>{{clfm.sceneNum}}</p>
                        <p><span>已投注:</span>{{clfm.castNote}}</p>
                        <p><span>总注数:</span>{{clfm.totalNote}}</p>
                    </div>
                    <div class="btn_org">立即投注</div>
                </div>
            </li>
            <li class="list" @click="goLink(xsnd.id)">
                <div class="left">
                    <img src="../../../assets/img/treasure/money.png" alt="">
                    <div class="tag">
                        <span>奖品 50元红包</span>
                    </div>
                </div>
                <div class="right">
                    <h3>{{xsnd.senceType}}</h3>
                    <div class="detail">
                        <p>本场编号 :</p>
                        <p>{{xsnd.sceneNum}}</p>
                        <p><span>已投注:</span>{{xsnd.castNote}}</p>
                        <p><span>总注数:</span>{{xsnd.totalNote}}</p>
                    </div>
                    <div class="btn_org">立即投注</div>
                </div>
            </li>
            <li class="list" @click="goLink(hydt.id)">
                <div class="left">
                    <img src="../../../assets/img/treasure/jd.png" alt="">
                    <div class="tag">
                        <span>京东千元购物卡</span>
                    </div>
                </div>
                <div class="right">
                    <h3>{{hydt.senceType}}</h3>
                    <div class="detail">
                        <p>本场编号 :</p>
                        <p>{{hydt.sceneNum}}</p>
                        <p><span>已投注:</span>{{hydt.castNote}}</p>
                        <p><span>总注数:</span>{{hydt.totalNote}}</p>
                    </div>
                    <div class="btn_org">立即投注</div>
                </div>
            </li>
            <li class="list">
                <div class="left">
                    <img src="../../../assets/img/treasure/aqi.png" alt="">
                    <div class="tag">
                        <span>爱奇艺会员一年</span>
                    </div>
                </div>
                <div class="right">
                    <h3>{{ymjr.senceType}}</h3>
                    <div class="detail">
                        <p>本场编号 :</p>
                        <p>{{ymjr.sceneNum}}</p>
                        <p><span>已投注:</span>{{ymjr.castNote}}</p>
                        <p><span>总注数:</span>{{ymjr.totalNote}}</p>
                    </div>
                    <div class="btn_pink">尽请期待</div>
                </div>
            </li>
            <li class="list">
                <div class="left">
                    <img src="../../../assets/img/treasure/jn.png" alt="">
                    <div class="tag">
                        <span>8888待还基金</span>
                    </div>
                </div>
                <div class="right">
                    <h3>{{nqct.senceType}}</h3>
                    <div class="detail">
                        <p>本场编号 :</p>
                        <p>{{nqct.sceneNum}}</p>
                        <p><span>已投注:</span>{{nqct.castNote}}</p>
                        <p><span>总注数:</span>{{nqct.totalNote}}</p>
                    </div>
                    <div class="btn_pink">尽请期待</div>
                </div>
            </li>
        </ul>
        <p class="tip">声明：<br>“幸运夺宝”不需要投入真实资金 <br>完成指定任务获取“金币”即可参与</p>
        <div class="acticity_alert" v-show="alert">
            <div class="activity_rule">
                <img src="../../../assets/img/treasure/alert_rule.png" alt="">
                <span @click="alert = false;" class="close"></span>
            </div>
        </div>
    </div>
</template>

<script>
    import {swiper,swiperSlide} from 'vue-awesome-swiper';
    export default {
        name: "treasure",
        data(){
            return {
                alert:false,
                appInfo:'',
                swiperOption: {
                    direction:'vertical',
                    observeParents: true,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    loop: true,
                    autoplay: {
                        delay: 2000,
                        disableOnInteraction: false
                    },
                },
                listUser:[],
                clfm:{},
                xsnd:{},
                hydt:{},
                ymjr:{},
                nqct:{},
            }
        },
        components:{
          swiper,swiperSlide
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper;
            }
        },
        mounted(){
            this.appInfo = sessionStorage.appInfo;
            const _appInfo = this.$util.GetQueryString('_appInfo');
            if(_appInfo){
                sessionStorage.appInfo = _appInfo;
                this.appInfo = _appInfo;
            }else {
                this.appInfo = sessionStorage.appInfo;
            }
            this.getHomeList();
        },
        methods:{
            //路由跳转
            goLink(id){
                this.$router.push({
                    path:'/treasureDetails',
                    query:{id}
                });
            },
            //获取首页list
            getHomeList(){
                let postData = {
                    appInfo:this.appInfo
                }
              this.$myHttp.formPost('/activity/homeList',postData,1).then(res=>{
                  if(res.result.code==='1000'){
                      this.clfm = res.result.data.listProd[0];
                      this.xsnd = res.result.data.listProd[1];
                      this.ymjr = res.result.data.listProd[2];
                      this.hydt = res.result.data.listProd[3];
                      this.nqct = res.result.data.listProd[4];
                      this.listUser = res.result.data.listUser;
                  }else if(res.result.code==='1003'){
                      window.location.href = '/jn/opennative?name=APP_LOGIN'
                  }else {
                      this.$util.Toast({message:res.result.msg});
                  }
              });
            },
        }
    }
</script>

<style scoped lang="less">
    .some-swiper {
        height: 56px;
        overflow: hidden;
        .swiper-slide {
            p{
                text-align: center;
                line-height: 56px;
                color: #ffffff;
            }
        }
    }
.container{
    background: url("../../../assets/img/treasure/bg1.png") no-repeat;
    background-size: 100%;
    padding-top: 414px;
    padding-bottom: 140px;
    position: relative;
    .rule{
        position: absolute;
        top: 54px;
        right: 0;
        width: 124px;
        line-height: 48px;
        background: url("../../../assets/img/treasure/rule.png") no-repeat;
        background-size: 100%;
        text-align: center;
        color: #ffffff;
    }
    .loop_user{
        width: 616px;
        height: 56px;
        background: url("../../../assets/img/treasure/loopUser.png") no-repeat;
        background-size: 100%;
        margin: 0 auto;
    }
    .list_box{
        width: 642px;
        margin: 20px auto 0px;
    }
    .list{
        width: 100%;
        height: 338px;
        margin-bottom: 60px;
        box-sizing: border-box;
        padding: 84px 26px;
        .left{
            width: 228px;
            height: 228px;
            float: left;
            position: relative;
            img{
                width: 228px;
            }
            .tag{
                position: absolute;
                width: 176px;
                height: 176px;
                background: url("../../../assets/img/treasure/tag.png") no-repeat;
                background-size: 100%;
                left: 0;
                top: 0;
                span{
                    position: absolute;
                    display: block;
                    height: 56px;
                    line-height: 56px;
                    width: 180px;
                    text-align: center;
                    transform: rotate(-45deg) translate(-42px,12px);
                    transform-origin: center;
                    color: #ffffff;
                }
            }
        }
        .right{
            float: left;
            width: 314px;
            margin-left: 32px;
            color: #736FE5;
            h3{
                background:#E5E7FC ;
                text-align: center;
                padding-top: 5px;
                line-height: 40px;
                font-size: 28px;
            }
            .detail{
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                flex-wrap:wrap;
                p{
                    line-height: 34px;
                    margin-bottom: 10px;
                }
                span{
                    margin-right: 10px;
                }
            }
            .btn_org{
                 width: 296px;
                 line-height: 77px;
                 height: 84px;
                 background: url("../../../assets/img/treasure/btn_org.png") no-repeat;
                 background-size: 100%;
                 text-align: center;
                 font-size: 28px;
                 color: #ffffff;
             }
            .btn_pink{
                width: 296px;
                line-height: 77px;
                height: 84px;
                background: url("../../../assets/img/treasure/btn_pink.png") no-repeat;
                background-size: 100%;
                text-align: center;
                font-size: 28px;
                color: #ffffff;
            }
        }
    }
    .list:first-of-type{
        background: url("../../../assets/img/treasure/clfm.png") no-repeat;
        background-size: 100%;
    }
    .list:nth-of-type(2){
        background: url("../../../assets/img/treasure/xsnd.png") no-repeat;
        background-size: 100%;
    }
   .list:nth-of-type(3){
        background: url("../../../assets/img/treasure/hydt.png") no-repeat;
        background-size: 100%;
    }
   .list:nth-of-type(4){
        background: url("../../../assets/img/treasure/ymjr.png") no-repeat;
        background-size: 100%;
    }
   .list:nth-of-type(5){
        background: url("../../../assets/img/treasure/nqct.png") no-repeat;
        background-size: 100%;
        margin-bottom: 0;
    }
    .tip{
        text-align: center;
        width: 642px;
        margin: 20px auto 0px;
        color: #ffffff;
    }
    .acticity_alert{
        z-index: 99;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.5);
        .activity_rule{
            width: 642px;
            margin: 60px auto 0;
            position: relative;
            img{
                width: 642px;
                display: block;
                margin: 0 auto;
            }
            span{
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
}
</style>