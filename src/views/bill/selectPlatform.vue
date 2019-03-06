<template>
    <div class="container">
        <div class="hearder">
            <div class="searchBox">
                <label for="serach"></label>
                <input id='serach' placeholder="搜索平台" v-model="searchName" @input="searchPaltform"/>
                <div class="addplatform" @click="dialog_Show=true">没找到?录入新平台</div>
            </div>
        </div>
        <div class="paltformList" v-show="isShowSearchList">
            <ul>
                <li v-for="(item,index) in searchList" :key="index" @click="selectedPaltform(item.platformName)">
                    <img v-show="!item.platformLogo" src="../../assets/logo.png" alt="logo">
                    <img v-show="item.platformLogo" :src="item.platformLogo" alt="logo">
                    <p>{{item.platformName}}</p>
                </li>
                <li v-show="!searchList.length" class="noListTip">抱歉,未搜素到相关平台~</li>
            </ul>
        </div>
        <div class="paltformList" v-show="!isShowSearchList">
            <div class="hotPaltform" v-show="hotPaltformList.length">
                <h3 class="hotTitle">热门平台</h3>
                <ul>
                    <li v-for="(item,index) in hotPaltformList" :key="index"  @click="selectedPaltform(item.platformName)">
                        <img v-show="!item.platformLogo" src="../../assets/logo.png" alt="logo">
                        <img v-show="item.platformLogo" :src="item.platformLogo" alt="logo">
                        <p>{{item.platformName}}</p>
                    </li>
                </ul>
            </div>
            <div class="hotPaltform" v-for="(paltform,key) in paltformList" :key="key">
                <h3 :id="key">{{key}}</h3>
                <ul>
                    <li v-for="(item,index) in paltform" :key="index" @click="selectedPaltform(item.platformName)">
                        <img v-show="!item.platformLogo" src="../../assets/logo.png" alt="logo">
                        <img v-show="item.platformLogo" :src="item.platformLogo" alt="logo">
                        <p>{{item.platformName}}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="!isShowSearchList" class="leftBar">
            <div class="leftBar_box">
                <a href="##">#</a>
                <a href="#A">A</a>
                <a href="#B">B</a>
                <a href="#C">C</a>
                <a href="#D">D</a>
                <a href="#E">E</a>
                <a href="#F">F</a>
                <a href="#G">G</a>
                <a href="#H">H</a>
                <a href="#I">I</a>
                <a href="#J">J</a>
                <a href="#K">K</a>
                <a href="#L">L</a>
                <a href="#M">M</a>
                <a href="#N">N</a>
                <a href="#O">O</a>
                <a href="#P">P</a>
                <a href="#Q">Q</a>
                <a href="#R">R</a>
                <a href="#S">S</a>
                <a href="#T">T</a>
                <a href="#U">U</a>
                <a href="#V">V</a>
                <a href="#W">W</a>
                <a href="#X">X</a>
                <a href="#Y">Y</a>
                <a href="#Z">Z</a>
            </div>
        </div>
        <div class="alert_fixed" v-show="dialog_Show">
            <div class="dialog">
                <input type="text" v-model="addPlatformName" placeholder="请输入平台名称">
                <p class="tip">提示: 该平台需审核成功之后才可添加账单</p>
                <div class="btn">
                    <div @click="dialog_Show=false">取消</div>
                    <div @click="handelPost">确定</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "selectPlatform",
        data(){
            return{
                searchName:'',
                addPlatformName:'',
                isShowSearchList:false, //是否展示搜索列表
                backUrl:this.$route.query.url,
                timer:null,
                searchListShow:false,
                dialog_Show:false,   //弹框显示隐藏
                hotPaltformList:[],
                searchList:[],
                paltformList:{},
            }
        },
        mounted(){
            this.getSearchList(1);
        },
        methods:{
            //添加平台
            handelPost(){
                this.dialog_Show=false;
                let postData = {
                    platformName:this.addPlatformName,
                }
                this.$myHttp.formPost('/bill/platform/insert',postData,2).then((res)=>{
                    if(res.result.code==='1000'){
                        this.$util.Toast({message:res.result.msg});
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                    this.addPlatformName = '';
                });
            },
            //模糊查询数据
            findListByName(){
                let postData = {
                    platformName:this.searchName
                }
                if(this.searchName===''){
                    this.searchList = [];
                    this.isShowSearchList = false;
                    return;
                }
                this.$myHttp.formPost('/bill/platform/findListByName',postData).then((res)=>{
                    if(res.result.code==='1000'){
                        this.searchList = res.result.data.dataList;
                        this.isShowSearchList = true;
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                });
            },
            //获取平台数据
            getSearchList(){
                this.$myHttp.formPost('/bill/platform/findList',{},1).then((res)=>{
                    if(res.result.code==='1000'){
                        this.paltformList = res.result.data && res.result.data.notTop;
                        this.hotPaltformList = res.result.data && res.result.data.isTop;
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                });
            },
            //搜索平台
            searchPaltform(){
                if(this.timer){
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(()=>{
                    this.findListByName();
                },200);
            },
            selectedPaltform(platformName) {
                // let params = {platformName};
                // window.location.href = '/opennative?name=CLOSE_WEBVIEW&params='+JSON.stringify(params);
                this.$router.push({name:this.backUrl,query:{platformName,action:'back_close_webview'}});
            }
        },
    }
</script>

<style scoped lang="less">
    .container{

    }
    .leftBar{
        width: 80px;
        position: fixed;
        right: 20px;
        top: 0;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .leftBar_box{
            display: flex;
            width: 100%;
            flex-direction:column;
            text-align: center;
            a{
                line-height: 32px;
                color:#14ABFA;
            }
        }
    }
    .hearder{
        width: 100%;
        background: #ffffff;
        height: 112px;
        padding-top: 20px;
    }
    .searchBox {
        border: 2px solid #14ABFA;
        background: #ffffff;
        border-radius: 42px;
        box-sizing: border-box;
        width: 690px;
        height: 84px;
        position: relative;
        margin-left: 5%;
        margin-bottom: 80px;
        padding: 20px 0px;
        label {
            width: 40px;
            height: 42px;
            position: absolute;
            top: 20px;
            left: 28px;
            background: url("../../assets/img/bill/search.png") no-repeat;
            background-size: 100%;
        }
        input {
            width: 100%;
            padding-left: 80px;
            font-size: 32px;
            line-height: 44px;
            box-sizing: border-box;
        }
        .addplatform {
            position: absolute;
            right: 30px;
            font-size: 28px;
            top: 20px;
            color: #333;
        }
     }
    .dialog{
        width: 540px;
        height: 278px;
        margin: 400px auto 0;
        padding-top: 50px;
        box-sizing: border-box;
        background: #FCFCFC;
        border-radius: 24px;
        position: relative;
        input{
            width: 474px;
            height: 64px;
            display: block;
            margin-left: 33px;
            padding-left: 10px;
            outline: none;
            box-sizing: border-box;
            border: 1px solid #e0e0e0;
            background: #ffffff;
            -webkit-appearance: none;
        }
        .tip{
            margin-left: 33px;
            margin-top: 20px;
            color: #666;
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
    .paltformList{
        margin-top: 16px;
        .noListTip{
            color: #999999;
        }
        .hotPaltform{
            width: 100%;
            .hotTitle{
                height: 80px;
                line-height: 80px;
                padding-left: 32px;
                font-size: 32px;
                color: #333;
                background: #ffffff;
            }
            h3{
                height: 40px;
                line-height: 40px;
                padding-left: 32px;
                font-size: 32px;
                color: #333;
            }
        }
        ul{
            li{
                height: 80px;
                line-height: 80px;
                font-size: 28px;
                background: #ffffff;
                padding-left: 32px;
                border-bottom: 1px solid #E8EAEF;
                display: flex;
                align-items: center;
                justify-content: start;
                img{
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                }
                p{
                    margin-left: 40px;
                    font-size: 28px;
                    color: #333;
                }
            }
            li:last-of-type{
                border: none;
            }
        }
    }
</style>