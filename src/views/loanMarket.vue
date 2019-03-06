<template>
    <div :class="this.$util.isApp()?'content':'content mb100'" v-infinite-scroll="getLoanLists"
         infinite-scroll-disabled="busy" infinite-scroll-distance="2">
        <div class="banner">
            <swiper :options="swiperOption" ref="mySwiper" class="some-swiper" v-if='bannerArr.length'>
                <!-- 这部分放你要渲染的那些内容 -->
                <swiper-slide :key="index" v-for="(item,index) in bannerArr">
                    <img :src="item.imageUrl" alt="">
                </swiper-slide>
                <!-- 这是轮播的小圆点 -->
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <ul class="title">
                <li class="line"></li>
                <li class="txt"><img src="../assets/img/market_line.png" alt=""><span>借钱</span></li>
                <li class="line"></li>
            </ul>
        </div>
        <div class="market">
            <market-item class="list" :item="item" v-for="(item,index) in items" :key="index"></market-item>
            <div class="scroll_loadingTip">{{loadingTxt}}</div>
        </div>
    </div>
</template>
<style scoped lang="less">
    .content {
        .banner {
            width: 100%;
            height: 428px;
            background: #fff;
            padding: 24px 32px;
            box-sizing: border-box;
            .some-swiper {
                height: 300px;
                .swiper-slide {
                    height: 300px;
                    img {
                        width: 100%;
                        height: 300px;
                        border-radius: 8px;
                    }
                }
            }
            .title {
                display: flex;
                height: 64px;
                margin-top: 28px;
                justify-content: space-between;
                .line {
                    width: 244px;
                    height: 16px;
                    margin-top: 24px;
                    background: url("../assets/img/market_line1.png") no-repeat;
                    background-size: 100%;
                }
                .txt {
                    display: flex;
                    justify-content: space-between;
                    span {
                        line-height: 64px;
                        font-size: 32px;
                        color: #333;
                        margin-left: 16px;
                    }
                    img {
                        width: 64px;
                        height: 64px;
                    }
                }
            }
        }
        .market {
            padding: 24px 24px;
            .list {
                margin-bottom: 24px;
            }
        }
    }
</style>
<script>
    import marketItem from "../components/marketItem";
    import "swiper/dist/css/swiper.css";
    import {swiper, swiperSlide} from 'vue-awesome-swiper';
    import infiniteScroll from 'vue-infinite-scroll'

    export default {
        name: "loanMarket",
        components: {marketItem, swiper, swiperSlide},
        directives: {infiniteScroll},
        data() {
            return {
                params: {
                    pageNum: 0,
                    pageSize: 8
                },
                swiperOption: {
                    observeParents: true,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    loop: true,
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
                            let item = this.bannerArr[i];
                            this.adClick(item);
                        }
                    }
                },
                total: 1,
                loadingTxt: '上拉加载更多',
                bannerArr: [],
                items: [],
                busy: false,
            }
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper;
            }
        },
        mounted() {
            this.getLoanLists();
            this.getBannerLists();
        },
        methods: {
            //广告点击事件
            adClick(item) {
                let postData = {
                    sourceType: 4,
                    sourceId: item.id,
                    sourceName: '首页banner',
                }
                this.$myHttp.post('/api/click/statis/addClick', postData).then((res) => {
                    if (res.code === 1) {
                        const url = item.linkUrl;
                        //自定义跳转页面
                        this.$util.customGoLink(url);
                    }
                });
            },
            getBannerLists() {
                const postData = {
                    location: 1
                }
                this.$myHttp.get("/api/ads/findAds", postData).then((res) => {
                    if (res.code == 1) {
                        this.bannerArr = res.data.adInfos;
                    }
                });
            },
            getLoanLists() {
                const nowTotal = this.params.pageNum * this.params.pageSize;
                if (this.loadingTxt === '加载中...') {
                    return;
                }
                if (this.total < nowTotal || this.total === nowTotal) {
                    this.loadingTxt = '没有更多了~';
                    return;
                } else {
                    this.params.pageNum++;
                    this.loadingTxt = '加载中...';
                }
                this.busy = true;
                this.$myHttp.get("/api/merchant/findList", this.params).then((res) => {
                    if (res.code == 1) {
                        this.items = this.items.concat(res.data.dataList);
                        this.total = res.data.page.total;
                        // this.pageNum = res.data.page.pageNum;
                        this.loadingTxt = this.total <= res.data.dataList.length ? '没有更多了~' : '上拉加载更多';
                        this.busy = false;
                    }
                });
            }
        }
    }
</script>
