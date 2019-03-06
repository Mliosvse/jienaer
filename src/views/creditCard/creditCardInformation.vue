<template>
    <div class="container" v-infinite-scroll="getList" infinite-scroll-disabled="busy" infinite-scroll-distance="2">
        <div class="title">
            <div class="txt">信用卡资讯</div>
        </div>
        <infomation-item :listdata="infomationList"></infomation-item>
    </div>
</template>

<script>
    import infomationItem from './templete/infomationItem'
    import infiniteScroll from 'vue-infinite-scroll'
    export default {
        name: "creditCardInformation",
        directives: {infiniteScroll},
        components: {infomationItem},
        data(){
            return {
                pageSize:8,
                currentPage:0,
                totalPage:1,
                infomationList:[
                    // {id:1,title:"欠了网贷还能办信用卡吗",gmtCreate:"2019-09-10",readnum:113},
                    // {id:2,title:"欠了网贷还能办信用卡吗",gmtCreate:"2019-09-10",readnum:113},
                    // {id:3,title:"欠了网贷还能办信用卡吗",gmtCreate:"2019-09-10",readnum:113},
                    // {id:3,title:"欠了网贷还能办信用卡吗",gmtCreate:"2019-09-10",readnum:113},
                    // {id:3,title:"欠了网贷还能办信用卡吗",gmtCreate:"2019-09-10",readnum:113},
                    // {id:3,title:"欠了网贷还能办信用卡吗",gmtCreate:"2019-09-10",readnum:113},
                    // {id:3,title:"欠了网贷还能办信用卡吗",gmtCreate:"2019-09-10",readnum:113},
                    // {id:3,title:"欠了网贷还能办信用卡吗",gmtCreate:"2019-09-10",readnum:113},
                ],
            }
        },
        methods:{
            getList(){
                if(this.currentPage>=this.totalPage) return;
                this.currentPage++;
                let postData = {
                    pageSize: this.pageSize,
                    currentPage: this.currentPage,
                }
                this.$myHttp.jsonPost('/informationCredit/infoList',postData,this.currentPage===1?1:'').then(res=>{
                    if(res.result.code==='1000'){
                        this.infomationList = this.infomationList.concat(res.result.data.datalist);
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