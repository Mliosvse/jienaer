<template>
    <ul class="list">
        <li class="item clearfix"  v-for="(item,index) in listdata" :key="index" @click="goLink(item)">
            <!--<div class="img"></div>-->
            <div class="img" :style="`background-image: url('${item.logoUrl}')`"></div>
            <div class="txt">
                <span></span>
                <p>{{item.mainTheme}}</p>
                <p>{{item.viceTheme}}</p>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "cardItem",
        data(){
            return{

            }
        },
        props:{
            listdata:{
                type:Array,
                defaultValue:[],
                required:true
            }
        },
        methods:{
            goLink(item){
                let postData = {
                    sourceId:item.id,
                    sourceName:item.bankName,
                    appInfo:sessionStorage.appInfo,
                }
                this.$myHttp.formPost('/creditHandleCard/checkView',postData).then(res=>{
                    if(res.result.code==='1000'){
                        window.location.href = '/jn/opennative?name=WEBVIEW&params='+this.$base64.encodeURI(JSON.stringify({"url": item.linkUrl}));
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
    .list{
        padding-top: 40px;
        .item{
            padding:0px 32px 50px;
            .img{
                float: left;
                width: 244px;
                height: 154px;
                background-color:#e8e8e8;
                background-size: 100% auto;
                background-position: center;
                border-radius: 8px;
            }
            .txt{
                float: right;
                text-align: right;
                position: relative;
                padding-top: 64px;
                box-sizing: border-box;
                span{
                    position: absolute;
                    top: 10px;
                    right: 0;
                    width: 24px;
                    height: 24px;
                    background: url("../../../assets/img/common/coinIcon.png") no-repeat;
                    background-size: 100%;
                }
                p{
                    color: #23262F;
                    font-size: 28px;
                }
            }
        }
    }
</style>