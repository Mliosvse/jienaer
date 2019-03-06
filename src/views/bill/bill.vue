<template>
    <section class="container">
        <div class="header">
            <p>{{totalMoney}}</p>
            <span>待还总额 (元)</span>
        </div>
        <img src="../../assets/img/bill/adimg.png" alt="">
        <div class="mybill">
            <h3>我的账单</h3>
            <div class="monthList_box" ref="listBox">
                <div class="monthList" :ref="key===closerDate?'current':null" v-for="(lists,key) in monthList" :key="key">
                    <h4>{{key}}</h4>
                    <ul>
                        <li v-for="(item,index) in lists" :key="index" @click="editBill(item.id)">
                            <van-swipe-cell :right-width="70" :on-close="onClose" :id="item.id">
                                <div class="swiperList">
                                    <div class="leftIcon"></div>
                                    <div class="rightBox">
                                        <img v-show="!item.platformLogo" src="../../assets/logo.png" alt="logo">
                                        <img v-show="item.platformLogo" :src="item.platformLogo" alt="logo">
                                        <div class="rightBox_content">
                                            <ul>
                                                <li>
                                                    <div class="black">{{item.borrowPlatform}}</div>
                                                    <div class="gary">还款日</div>
                                                </li>
                                                <li>
                                                    <div class="black">{{item.nowPeriods}}/{{item.totalPeriods}}期</div>
                                                    <div class="gary">{{item.dateOfRepay}}</div>
                                                </li>
                                                <li class="orange">
                                                    <div class="orange tar">￥{{item.eachRepay}}</div>
                                                    <div class="gary tar">{{item.borrowStatus | status}}</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <span class="swiperDelete" slot="right">删除</span>
                            </van-swipe-cell>
                        </li>
                    </ul>
                </div>
                <div class="noBills" v-show="!Object.keys(monthList).length">
                    <img src="../../assets/img/bill/nobills.png" alt="">
                    <p>您还没有账单哦...</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <jnButton class="btn" :click="addBill">记一笔</jnButton>
        </div>
        <div class="alert_fixed" v-show="dialog_Show">
            <div class="dialog">
                <p>确认删除该账单?</p>
                <div class="btn">
                    <div @click="dialog_Show=false">取消</div>
                    <div @click="deleteBill">确定</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "bill",
        data(){
            return{
                baseUrl: process.env.BASE_URL,
                dialog_Show:false,     //弹框显示隐藏
                totalRepay:"0",   //待还款金额
                monthList:{},   //账单数据
                closerDate:'',   //居中显示的日期
                id:'',           //选中的账单id
                userName: localStorage.userName,
                appInfo:localStorage.appInfo?JSON.parse(localStorage.appInfo):{},
            }
        },
        filters: {
            status: function (value) {
                let result = '';
                if(value===0){
                    result = '逾期';
                }else if(value===1){
                    result = '待还';
                }else if(value===2){
                    result = '结清';
                }
                return result;
            }
        },
        computed:{
            //待还总额处理
          totalMoney:function () {
              return this.$util.fmoney(this.totalRepay,2);
          }
        },
        mounted(){
            if(!this.appInfo||this.appInfo.loginState==='0'){
                window.location.href = '/jn/opennative?name=APP_LOGIN';
            }else {
                this.getData();
            }
        },
        methods:{
            //计算最接近于当月的未来日期,无未来日期则为空
            getCloseToDay(obj){
                if(!(obj instanceof Object))return null;
                let closeIndex = null;
                for(let key in obj){
                    const time = new Date(key).getTime();
                    const nowYear = new Date().getFullYear();
                    let nowMonth = new Date().getMonth()+1;
                    nowMonth = nowMonth<10?'0'+nowMonth:nowMonth;
                    const nowDate = nowYear +'-'+nowMonth;
                    const nowTime = new Date(nowDate).getTime();
                    if(time-nowTime<0){
                        break;
                    }
                    closeIndex = key;
                }
                return closeIndex;
            },
            //添加账单
            addBill(){
                localStorage.removeItem('platformName');
                if(this.$util.isApp()){
                    let url = window.location.origin+this.baseUrl+'addBillSingle?action=back_close_webview';
                    //自定义跳转页面
                    const params = {url};
                    window.location.href = '/opennative?name=WEBVIEW&params=' + this.$base64.encodeURI(JSON.stringify(params));
                }else {
                    this.$router.push('addBillSingle');
                }
            },
            //菜单点击事件
            editBill(value){
                this.$router.push({name:'editBill',query:{id:value}});
            },
            //滑动删除点击
            onClose(clickPosition, instance) {
                switch (clickPosition) {
                    case 'left':
                    case 'cell':
                    case 'outside':
                        instance.close();
                        break;
                    case 'right':
                        this.id = instance.$attrs.id;
                        this.dialog_Show = true;
                        break;
                    default:
                        break;
                }
            },
            //确认删除账单
            deleteBill(){
                this.dialog_Show = false;
                let postData = {
                    id:this.id,
                    isDelete:1
                }
                this.$myHttp.formPost('/bill/updateBill',postData,2).then((res)=>{
                    if(res.result.code==='1000'){
                       this.getData(2);
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                });
            },
            //获取账单数据
            getData(loadingType=1){
                let postData = {
                    userName:this.userName,
                }
                this.$myHttp.formPost('/bill/findList',postData,loadingType).then((res)=>{
                    if(res.result.code==='1000'){
                        this.monthList = res.result.data && res.result.data.order;
                        this.closerDate = this.getCloseToDay(this.monthList);
                        this.totalRepay = res.result.data && res.result.data.totalRepay;
                        this.$nextTick(() => {
                            if (this.$refs.current) {
                                //获取最近月份dom距离父元素顶部距离
                                const topHeight = this.$refs.current[0].offsetTop - 10;
                                this.$refs.listBox.scroll(0, topHeight);
                            }
                        })
                    }else if(res.result.code==='1003'){
                        window.location.href = '/jn/opennative?name=APP_LOGIN';
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                });

            }
        }
    }
</script>

<style scoped lang="less">
    .container{
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .header{
            background: url("../../assets/img/bill/banner.png") no-repeat;
            background-size: 100% 100%;
            height: 240px;
            color: #ffffff;
            text-align: center;
            p{
                font-size: 80px;
                padding-top: 50px;
            }
        }
        &>img{
            display: block;
            margin: 6px auto 16px;
            height: 160px;
        }
        .mybill{
            h3{
                background: #ffffff;
                height: 78px;
                line-height: 78px;
                padding-left: 32px;
            }
            .monthList_box{
                position: absolute;
                height: calc(100% - 650px);
                overflow-y:auto ;
                width: 100%;
            }
            .monthList{
                margin-top: 20px;
                h4{
                    width: 234px;
                    height: 50px;
                    line-height: 50px;
                    background:#36BAFF;
                    border-bottom-right-radius: 25px;
                    border-top-right-radius: 25px;
                    position: relative;
                    padding-left: 80px;
                    box-sizing: border-box;
                    color: #ffffff;
                }
                h4:before{
                   content: '';
                    position: absolute;
                    width: 28px;
                    height: 30px;
                    top: 10px;
                    left: 34px;
                    background: url("../../assets/img/bill/rili.png") no-repeat;
                    background-size: 100%;
                }
                &>ul{
                    margin: 16px 0px;
                    &>li{
                        height: 156px;
                        margin-bottom: 16px;
                        .swiperDelete{
                            display: block;
                            height: 140px;
                            width: 140px;
                            color: #ffffff;
                            font-size: 30px;
                            text-align: center;
                            line-height: 140px;
                            margin-left: 2px;
                            background: #ff4444;
                        }
                    }
                }
                .leftIcon{
                    float: left;
                    width: 60px;
                    height: 156px;
                    position: relative;
                }
                .leftIcon:before{
                    content: '';
                    display: block;
                    width: 22px;
                    height: 22px;
                    position: absolute;
                    top: 0;
                    left: 38px;
                    background: #c0c0c0;
                    border-radius: 50%;
                }
                .leftIcon:after{
                    content: '';
                    display: block;
                    width: 6px;
                    height: 126px;
                    position: absolute;
                    bottom: 0;
                    left: 46px;
                    background: #c0c0c0;
                }
                .rightBox{
                    background: #ffffff;
                    width: 650px;
                    height: 140px;
                    background: #ffffff;
                    border-bottom-left-radius: 50px;
                    float: right;
                    padding: 26px 32px 0 32px;
                    box-sizing: border-box;
                    img{
                        width: 88px;
                        height: 88px;
                        float: left;
                        border-radius: 12px;
                    }
                    ul{
                        display: flex;
                        float: right;
                        width: 460px;
                        height: 88px;
                        justify-content: space-between;
                        div{
                            line-height: 46px;
                            height: 46px;
                            margin-bottom: 6px;
                        }
                        .orange{
                            font-weight: bold;
                            font-size: 32px;
                            color: #F56834;
                        }
                        .black{
                            font-size: 32px;
                            font-weight: bold;
                            color: #333333;
                        }
                        .gary{
                            font-size: 28px;
                            color: #999999;
                        }
                        .tar{
                            text-align: right;
                        }
                    }
                }
            }
            .noBills{
                padding-top: 146px;
                img{
                    width: 244px;
                    height: 244px;
                    display: block;
                    margin: 0 auto 40px;
                }
                p{
                    text-align: center;
                    color: #333333;
                    font-size: 44px;
                }
            }
        }
        .footer{
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            height: 140px;
            padding-top: 20px;
            box-sizing: border-box;
        }
        .dialog{
            width: 540px;
            height: 278px;
            margin: 400px auto 0;
            padding-top: 70px;
            box-sizing: border-box;
            background: #FCFCFC;
            border-radius: 24px;
            position: relative;
            &>p{
                color:#030303;
                font-size: 34px;
                text-align: center;
            }
            .btn{
                position: absolute;
                bottom: 0;
                left: 0;
                display: flex;
                width: 100%;
                height: 86px;
                line-height: 86px;
                font-size: 34px;
                border-top: 1px solid #e0e0e0;
                justify-content: space-between;
                div{
                    width: 50%;
                    text-align: center;
                    color: #007AFF;
                }
                div:first-of-type{
                    border-right: 1px solid #e0e0e0;
                }
            }
        }
    }
</style>