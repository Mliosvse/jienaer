<template>
    <div class="container">
       <div class="banner">
           <img src="../../../assets/img/treasure/coin.png" alt="">
           <p>{{userCoin}}枚金币</p>
       </div>
        <ul class="lists">
            <li class="item clearfix">
                <div class="left">
                    <h4>每日登录</h4>
                    <p>每日登录App可领取一枚金币。</p>
                </div>
                <div class="right" @click="loginGetCoin">来领取</div>
            </li>
            <li class="item clearfix">
                <div class="left">
                    <h4>平台注册 <router-link to="guide" class="question"></router-link></h4>
                    <p>每注册一个平台后，回到该页面，点击“来领取”按要求上传资料，即可获得一枚金币。</p>
                </div>
                <div class="right" @click="goBorrow">去注册</div>
                <div class="right" @click="alert=true;">来领取</div>
            </li>
            <li class="item clearfix">
                <div class="left">
                    <h4>实名绑卡</h4>
                    <p>实名绑卡则可以获得一枚金币。</p>
                </div>
                <div class="right wait">敬请期待</div>
            </li>
            <li class="item clearfix">
                <div class="left">
                    <h4>邀请用户</h4>
                    <p>邀请一个新用户实名可以获得 一枚金币。</p>
                </div>
                <div class="right wait">敬请期待</div>
            </li>
        </ul>
        <div class="alert_from" v-show="alert">
            <div class="alert_content" v-show="alert">
                <h3>注册验证->领取金币 <router-link to="guide"></router-link></h3>
                <select name="" v-model="platform">
                    <option value="" selected hidden>选择成功注册的平台</option>
                    <option v-for="(item,index) in platformList" :value="item.id" :key="index">{{item.lsm_name}}</option>
                </select>
                <textarea v-model="messageText" placeholder="请将收到所选平台的注册短信复制粘贴在这里" />
                <div class="alert_btn" @click="registerGetCoin">确定</div>
                <span @click="alert = false;" class="close"></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "goldCoin",
        data(){
            return {
                alert:false,
                platformList:[],
                userName:JSON.parse(sessionStorage.appInfo).userName,
                userCoin:'',
                mobile:'',
                platform:'',
                messageText:'',
            }
        },
        mounted(){
            this.getPlatformList();
        },
        methods:{
            //每日登录领取金币
            loginGetCoin(){
                let postData = {
                    userName:this.userName
                }
                this.$myHttp.formPost('/activity_gold/getGoldForLogin',postData).then(res=>{
                    if(res.result.code==='1000'){
                        this.userCoin = res.result.data.gold;
                        this.$util.Toast({message:'领取成功!'});
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                })
            },
            //注册获得金币
            registerGetCoin(){
                if(this.platform===''){
                    this.$util.Toast({message:"请选择注册平台"});
                    return;
                }
                if(this.messageText===''){
                    this.$util.Toast({message:"请输入短信内容"});
                    return;
                }
                let postData = {
                    userName: this.userName,
                    change_way: 2,
                    mer_id:this.platform,
                    mer_sms:this.messageText,
                }
                this.$myHttp.formPost('/activity_gold/getGoldForRegiest',postData,2).then(res=>{
                    this.platform = '';
                    if(res.result.code==='1000'){
                        this.alert = false;
                        this.userCoin = res.result.data.gold;
                        this.$util.Toast({message:'领取成功!'});
                    }else {
                        this.alert = false;
                        this.$util.Toast({message:res.result.msg});
                    }
                })
            },
            //获取平台列表
            getPlatformList(){
              this.$myHttp.formPost('/activity_gold/getAllProducts',{userName:this.userName},1).then(res=>{
                  if(res.result.code==='1000'){
                      this.platformList = res.result.data.products;
                      this.userCoin = res.result.data.userCoin;
                  }
              })
            },
            //跳转原生借款列表页面
            goBorrow(){
                window.location.href = '/opennative?name=BORROW&params='
            }
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
    .banner{
        margin-bottom: 40px;
        img{
            display: block;
            margin: 0 auto;
            width: 168px;
        }
        p{
            text-align: center;
            font-size: 36px;
            color: #ffffff;
        }
    }
    .lists{
        width: 642px;
        margin: 0 auto;
        .item{
            background: #ffffff;
            border: 10px solid #736FE5;
            border-radius: 4px;
            padding: 42px 24px 36px 36px;
            box-sizing: border-box;
            margin-bottom: 20px;
            .left{
                width: 314px;
                float: left;
                h4{
                    color: #736FE5;
                    font-size: 32px;
                    position: relative;
                    .question{
                        display: block;
                        position: absolute;
                        width: 28px;
                        height: 28px;
                        left: 144px;
                        top: 6px;
                        background: url("../../../assets/img/treasure/question.png") no-repeat;
                        background-size: 100%;
                    }
                }
                p{
                    color: #949BA9;
                    line-height: 36px;
                }
            }
            .right{
                float: right;
                width: 216px;
                height: 84px;
                background: url("../../../assets/img/treasure/smBtn_org.png") no-repeat;
                background-size: 100%;
                text-align: center;
                line-height: 78px;
                font-size: 28px;
                color: #ffffff;
            }
            .wait{
                background: url("../../../assets/img/treasure/smBtn_pink.png") no-repeat;
                background-size: 100%;
            }
        }
    }
    .alert_from{
        z-index: 99;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.5);
        .alert_content{
            width: 642px;
            height: 756px;
            background: url("../../../assets/img/treasure/alert_from.png") no-repeat;
            background-size: 100%;
            position: relative;
            margin: 78px auto 0;
            h3{
                line-height: 64px;
                text-align: center;
                font-size: 46px;
                color: #ffffff;
                font-weight: normal;
                padding-top: 66px;
                a{
                    width: 34px;
                    height: 34px;
                    display: inline-block;
                    background: url("../../../assets/img/treasure/wenhao.png") no-repeat;
                    background-size: 100%;
                }
            }
            select{
                border: 1px solid #cccccc;
                width: 522px;
                display: block;
                height: 100px;
                background: #ffffff;
                margin: 78px auto 24px;
                padding-left: 32px;
                border-radius: 0px;
                color: #333;
            }
            textarea{
                display: block;
                width: 522px;
                height: 240px;
                margin: 0 auto;
                border-radius: 0px;
                border: 1px solid #cccccc;
                padding: 30px 32px;
                box-sizing: border-box;
            }
            .alert_btn{
                width: 536px;
                height: 104px;
                margin: 28px auto 0px;
                background: url("../../../assets/img/treasure/btn_alert.png") no-repeat;
                background-size: 100%;
                text-align: center;
                color: #ffffff;
                font-size: 32px;
                line-height: 100px;
            }
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
</style>