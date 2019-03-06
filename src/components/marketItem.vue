<template>
    <div class="item">
        <div class="item_box" @click="goDetails">
            <img :src="item.imageUrl" alt="">
            <div class="right">
                <div class="title">
                    <div>{{item.productName}}</div>
                    <img src="../assets/img/tag1.jpg" alt="">
                    <img src="../assets/img/tag2.png" alt="">
                </div>
                <ul class="details clearfix">
                    <li>日利率：<span class="black">{{item.apr}}%</span></li>
                    <li>期限：<span class="black">{{item.period}}天</span></li>
                    <li>贷款范围：<span>{{item.amountScope}}元</span></li>
                </ul>
            </div>
            <div v-show="item.isTop" class="tag">
                <span>优选</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "marketItem",
        data(){
            return{

            }
        },
        props: {
            item: Object,
        },
        methods:{
            goDetails(){
                let postData = {
                    sourceType:1,
                    sourceId:this.item.id,
                    sourceName:this.item.productName,
                }
                this.$myHttp.post('/api/click/statis/save',postData).then((res)=>{
                    if(res.code===1){
                        let url = this.item.linkUrl;
                        //自定义跳转页面
                        this.$util.customGoLink(url);
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less">
    .item{
        background: #ffffff;
        border-radius:8px;
        padding: 48px 32px;
        .item_box{
            height: 128px;
            position: relative;
            display: flex;
            justify-content: space-between;
            img{
                width: 128px;
                height: 128px;
                border-radius: 28px;
            }
            .right{
                width: calc(100% - 160px);
            }
            .tag{
                width: 80px;
                height: 80px;
                position: absolute;
                background: url("../assets/img/tag.png") no-repeat;
                right: -32px;
                top: -48px;
                span{
                    line-height: 20px;
                    position: absolute;
                    font-size: 20px;
                    color: #fff;
                    transform: rotate(45deg);
                    top: 16px;
                    left: 36px;
                }
            }
            .title{
                color: #333;
                display: flex;
                justify-content: start;
                margin-top: 6px;
                div{
                    line-height: 28px;
                    font-size: 28px;
                    color: #333;
                    font-weight: bold;
                }
                img{
                    width: 93px;
                    height: 32px;
                    margin-left: 16px;
                    position: relative;
                    top: -5px;
                }
            }
            .details{
                margin-top: 12px;
                li{
                    width: 50%;
                    float: left;
                    color: #999999;
                    font-size: 28px;
                    span{
                        color: #FE1955;
                    }
                }
                .black{
                    color: #333333;
                }
                li:last-of-type{
                    width: 100%;
                }
            }
        }
    }
</style>