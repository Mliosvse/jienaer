<template>
    <div class="content" v-infinite-scroll="getSecretLists" infinite-scroll-disabled="busy"
         infinite-scroll-distance="2">
        <secret-item class="list" v-for="(item,index) in items" :item="item" :key="index"></secret-item>
        <div class="scroll_loadingTip">{{loadingTxt}}</div>
    </div>
</template>
<style scoped lang="less">
    .content {
        padding: 24px 32px 12px;
        .list:first-child {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
    }
</style>
<script>
    import secretItem from '../components/secretItem'
    import infiniteScroll from 'vue-infinite-scroll'

    export default {
        name: "loanSecret",
        directives: {infiniteScroll},
        components: {
            secretItem
        },
        data() {
            return {
                params: {
                    pageNum: 0,
                    pageSize: 8,
                    versionCode: ''
                },
                total: 1,    //总页数
                loadingTxt: '上拉加载更多',
                items: [],  //借款秘籍数据
                appInfo: this.$util.isApp(),
                busy: false,
            }
        },
        mounted() {
            this.getSecretLists();
        },
        methods: {
            getSecretLists() {
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
                this.params.versionCode = this.appInfo ? this.appInfo.appVersion : '';
                this.$myHttp.get("/api/information/findList", this.params).then((res) => {
                    if (res.code == 1) {
                        this.items = this.items.concat(res.data.dataList);
                        this.total = res.data.page.total;
                        this.loadingTxt = this.total <= res.data.dataList.length ? '没有更多了~' : '上拉加载更多';
                    }
                });
            }
        }

    }
</script>
