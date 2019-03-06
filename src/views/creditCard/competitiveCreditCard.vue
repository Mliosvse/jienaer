<template>
    <div class="container" v-infinite-scroll="getList" infinite-scroll-disabled="busy" infinite-scroll-distance="2">
        <div class="title">
            <div class="txt">办卡精选</div>
        </div>
        <card-item :listdata="creditCardList"></card-item>
    </div>
</template>

<script>
    import cardItem from './templete/cardItem'
    import infiniteScroll from 'vue-infinite-scroll'
    export default {
        name: "competitiveCreditCard",
        directives: {infiniteScroll},
        components: {cardItem},
        data(){
            return {
                currentPage:0,
                pageSize:8,
                totalPage:1,
                creditCardList:[
                    // {id:1,name:"招商信用卡",des:"100%取现额度",link:'http://www.baidu.com'},
                    // {id:2,name:"招商信用卡",des:"100%取现额度",link:'http://www.baidu.com'},
                    // {id:3,name:"招商信用卡",des:"100%取现额度",link:'http://www.baidu.com'},
                    // {id:3,name:"招商信用卡",des:"100%取现额度",link:'http://www.baidu.com'},
                    // {id:3,name:"招商信用卡",des:"100%取现额度",link:'http://www.baidu.com'},
                    // {id:3,name:"招商信用卡",des:"100%取现额度",link:'http://www.baidu.com'},
                    // {id:3,name:"招商信用卡",des:"100%取现额度",link:'http://www.baidu.com'},
                    // {id:3,name:"招商信用卡",des:"100%取现额度",link:'http://www.baidu.com'},
                ]
            }
        },
        methods:{
            getList(){
                if(this.currentPage>=this.totalPage) return;
                this.currentPage++;
                let postData = {
                    currentPage:this.currentPage,
                    pageSize:this.pageSize
                }
               this.$myHttp.jsonPost('/creditHandleCard/querylists',postData,this.currentPage===1?1:'').then(res=>{
                   if(res.result.code=='1000'){
                       this.creditCardList = this.creditCardList.concat(res.result.data.Lists);
                       this.totalPage = res.result.data.totalPage;
                   }else {
                       this.$util.Toast({message:res.result.msg});
                   }
               })
            }
        },
        mounted(){

        }
    }
</script>

<style scoped lang="less">
    .container{
        width: 686px;
        margin: 28px auto 28px;
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
        }
    }
</style>