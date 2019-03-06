<template>
    <ul class="list">
        <li class="item clearfix"  v-for="(item,index) in listdata" :key="index" @click="goLink(item.id)">
            <!--<div class="img"></div>-->
            <div class="img" :style="`background-image: url('${item.pic}')`"></div>
            <div class="txt">
                <i></i>
                <p>{{item.title}}</p>
                <p class="dateNum">{{item.gmtCreate|disposeTime}} <span>{{item.readnum}}</span>阅读</p>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "itemtep",
        data(){
            return {
                baseUrl: process.env.BASE_URL,
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
            //打开新的原生webview页面
            goLink(id){
                const url = window.location.origin + `${this.baseUrl}creditInfoDetails?id=${id}`;
                window.location.href = '/jn/opennative?name=WEBVIEW&params='+this.$base64.encodeURI(JSON.stringify({"url": url}));
                // this.$router.push({path:'creditInfoDetails',query:{id}});
            }
        },
        filters: {
            disposeTime (time) {
                if (time){
                    return time.substring(0,10);
                } else {
                    return time;
                }
            },
        },
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
                i{
                    position: absolute;
                    top: 10px;
                    right: 0;
                    width: 24px;
                    height: 24px;
                    background: url("../../../assets/img/common/coinIcon2.png") no-repeat;
                    background-size: 100%;
                }
                span{
                    margin-left: 20px;
                }
                p{
                    color: #23262F;
                    font-size: 28px;
                }
                .dateNum{
                    color: #999999;
                }
            }
        }
    }
</style>