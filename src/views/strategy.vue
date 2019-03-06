<template>
    <div class="container">
        <div class="article">
            <div class="title">
                <div class="txt">下款秘籍</div>
                <div class="more" @click="goLink('loanSecret')">查看更多</div>
            </div>
            <secret-item class="list" v-for="(item,index) in articleList" :item="item" :key="index"></secret-item>
        </div>
        <swiper :options="swiperOption" ref="mySwiper" class="some-swiper" v-if='items.length'>
            <!-- 这部分放你要渲染的那些内容 -->
            <swiper-slide :key="index" v-for="(item,index) in items">
                <img :src="item.imageUrl"  alt="">
            </swiper-slide>
            <!-- 这是轮播的小圆点 -->
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div :class="this.$util.isApp()?'novel':'novel mb100'">
            <div class="title">
                <div class="txt">海量小说</div>
                <div class="more" @click="adPlatName">查看更多</div>
            </div>
            <ul>
                <li class="novelList clearfix" @click="adStory(item)" v-for="(item,index) in platform.storyList" :item="item" :key="index">
                    <img :src="item.storyImg" alt="">
                    <div class="storyRight">
                        <p class="storyTitle">{{item.storyName}}</p>
                        <p class="storyDes">{{item.intro}}</p>
                        <span v-for="(tag,index) in (item.storyTag.split(','))" :key="index">{{tag}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import "swiper/dist/css/swiper.css";
    import {swiper,swiperSlide} from 'vue-awesome-swiper';
      import secretItem from '../components/secretItem'
    export default {
        name: "strategy",
        components:{
            swiper,
            swiperSlide,
            secretItem
        },
        data (){
            return {
                baseUrl:process.env.BASE_URL,      //基础路由(环境变量)
                items:[],
                swiperOption: {
                    observeParents: true,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    loop: true,
                    // preventClicks: false,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false
                    },
                    pagination: {
                        el: '.swiper-pagination',
                    },
                    on: {
                        click: () => {
                            let myswiper = this.$refs.mySwiper.swiper;
                            let i = myswiper.realIndex;
                            let item = this.items[i];
                            this.adClick(item);
                        }
                    }
                },
                articleList:[],
                platform:{},   //小说平台信息
            }
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper;
            }
        },
        methods:{
            //获取banner图片
            getBannerArr(){
                let params = {location: 2};
                this.$myHttp.get("/api/ads/findAds",params).then((res)=>{
                    if(res.code==1){
                        this.items = res.data.adInfos;
                    }
                });
            },
            //获取文章列表
            getArticleList(){
                const params = {
                    pageNum: 1,
                    pageSize: 3
                }
                this.$myHttp.get("/api/information/findList",params).then((res)=>{
                    if(res.code==1){
                        this.articleList = res.data.dataList;
                    }
                });
            },
            //获取小说列表
            getStory(){
                this.$myHttp.get("/api/information/findSrory").then((res)=>{
                    if(res.code==1){
                        this.platform = res.data[0];
                    }
                });
            },
            //广告点击事件
            adClick(item){
                let postData = {
                    sourceType:4,
                    sourceId:item.id,
                    sourceName:'福利banner',
                }
                this.$myHttp.post('/api/click/statis/addClick',postData).then((res)=>{
                    if(res.code===1){
                        const url = item.linkUrl;
                        //自定义跳转页面
                        this.$util.customGoLink(url);
                    }
                });
            },
            //小说点击事件
            adStory(item){
                let postData = {
                    sourceType:5,
                    sourceId:item.id,
                    sourceName:item.storyName,
                }
                this.$myHttp.post('/api/click/statis/addClick',postData).then((res)=>{
                    if(res.code===1){
                        const url = item.storyUrl;
                        //自定义跳转页面
                        this.$util.customGoLink(url);
                    }
                });
            },
            //平台点击事件
            adPlatName(){
                let postData = {
                    sourceType:6,
                    sourceId:this.platform.id,
                    sourceName:this.platform.platformName,
                }
                this.$myHttp.post('/api/click/statis/addClick',postData).then((res)=>{
                    if(res.code===1){
                        const url = this.platform.platformUrl;
                        //自定义跳转页面
                        this.$util.customGoLink(url);
                    }
                });
            },
            //跳转链接
            goLink(path){
                let url = window.location.origin+this.baseUrl+path;
                //自定义跳转页面
                this.$util.customGoLink(url);
            }
        },
        mounted(){
            this.getArticleList();
            this.getBannerArr();
            this.getStory();
        }
    }
</script>

<style scoped lang="less">
    .container{
        padding: 24px 32px 20px;
        .title{
            background: #fff;
            display: flex;
            height: 96px;
            line-height: 96px;
            border-bottom: 0.5px solid #ddd;
            justify-content: space-between;
            .txt{
                padding-left: 32px;
                font-size: 32px;
                color: #333;
            }
            .more{
                padding-right: 56px;
                font-size: 28px;
                color: #999;
                position: relative;
            }
            .more:after{
                content: '';
                position: absolute;
                background: url("../assets/img/rightArrow.png") no-repeat;
                background-size: 100%;
                width: 16px;
                height: 28px;
                top: 32px;
                right: 32px;
            }
        }
        .article{
            background: #fff;
            border-radius: 8px;
            margin-bottom: 24px;
        }
        .some-swiper {
            height: 200px;
            border-radius: 8px;
            z-index: 11;
            .swiper-slide {
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .novel {
            margin-top: 24px;
            border-radius: 8px;
            padding-bottom: 40px;
            .novelList:last-of-type{
                border: none;
            }
            .novelList {
                background: #fff;
                width: 100%;
                border-bottom: 1px solid #eee;
                padding: 32px;
                box-sizing: border-box;
                .storyRight {
                    float: left;
                    margin-left: 32px;
                    .storyTitle{
                        margin-bottom: 10px;
                        font-size: 32px;
                        color: #333;
                    }
                    .storyDes{
                        width: 410px;
                        margin-bottom: 24px;
                        overflow: hidden;
                        -webkit-box-orient: vertical;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        min-height: 90px;
                        font-size: 28px;
                        color: #999;
                        -webkit-line-clamp: 3;
                    }
                    span {
                        color: #14ABFA;
                        width: 72px;
                        margin-left: 8px;
                        line-height: 34px;
                        font-size: 24px;
                        padding: 0 14px;
                        text-align: center;
                        background: url("../assets/img/outline.png") no-repeat;
                        background-size: 100% 100%;
                    }
                }
                img {
                    float: left;
                    border-radius: 8px;
                    width: 180px;
                    height: 240px;
                }
            }
        }
    }
</style>