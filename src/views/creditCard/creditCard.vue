<template>
    <div class="container">
        <div class="content">
            <div class="card" v-if="creditCardList.length">
                <div class="title">
                    <div class="txt">办卡精选</div>
                    <div class="more" @click="goDetail('competitiveCreditCard');">更多</div>
                </div>
                <card-item :listdata="creditCardList"></card-item>
            </div>
            <div class="information" v-if="infomationList.length">
                <div class="title">
                    <div class="txt">信用卡资讯</div>
                    <div class="more" @click="goDetail('creditCardInformation');">更多</div>
                </div>
                <infomation-item :listdata="infomationList"></infomation-item>
            </div>
        </div>
    </div>
</template>

<script>
    import cardItem from './templete/cardItem'
    import infomationItem from './templete/infomationItem'
    export default {
        name: "creditCard",
        components: {cardItem,infomationItem},
        data(){
            return {
                creditCardList:[],
                infomationList:[],
            }
        },
        methods:{
            goDetail(path){
                this.$router.push({path});
            },
            getDataList(){
                this.$myHttp.jsonPost('/creditHandleCard/handleCardHomePage',{},1).then(res=>{
                   if(res.result.code==='1000'){
                        this.creditCardList = res.result.data.credit;
                        this.infomationList = res.result.data.info;
                   }
                })
            }
        },
        mounted(){
            const _appInfo = this.$util.GetQueryString('_appInfo');
            if(_appInfo){
                sessionStorage.appInfo = _appInfo;
                this.appInfo = _appInfo;
            }else {
                this.appInfo = sessionStorage.appInfo;
            }
            this.getDataList();
        }
    }
</script>

<style scoped lang="less">
.container{
    padding-bottom: 40px;
}
.content{
    width: 686px;
    margin: 28px auto 0px;
    border-radius: 8px;
    background: #fff;
    .title{
        display: flex;
        height: 98px;
        line-height: 98px;
        border-bottom: 0.5px solid #E8EAEF;
        justify-content: space-between;
        .txt{
            padding-left: 32px;
            font-size: 32px;
            font-weight: bold;
            color: #23262F;
        }
        .more{
            padding-right: 56px;
            font-size: 32px;
            color: #999;
            position: relative;
        }
        .more:after{
            content: '';
            position: absolute;
            background: url("../../assets/img/rightArrow.png") no-repeat;
            background-size: 100%;
            width: 24px;
            height: 42px;
            top: 25px;
            right: 32px;
        }
    }
}
</style>