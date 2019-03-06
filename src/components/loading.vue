<template>
    <div class="loading" :class="{rgba:loadingType===2}">
        <div class="type1" v-show="loadingType===1">
            <img  src='../assets/img/common/loading.gif'/>
            <div>loading...</div>
        </div>
        <div class="type2" v-show="loadingType===2">
            <img src='../assets/img/common/loading2.gif'/>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: "loading",
        data(){
            return{

            }
        },
        computed:{
            ...mapState(['loadingType'])
        },
        props: {

        },
        methods:{
           
        }
    }
</script>

<style scoped lang="less">
    .loading{
        position:fixed;
        top:0;
        left:0;
        bottom:0;
        right:0;
        background:#fff;
        color:#929baa;
        z-index:99;
        &>div{
            width: 120px;
            height: 120px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -60px;
            margin-top: -60px;
        }
        .type1{
            img{
                display:block;
                margin-left: 35px;
                width:50px;
                height:50px;
            }
            div{
                margin-top: 20px;
                text-align: center;
            }
        }
        .type2{
            padding: 30px;
            box-sizing: border-box;
            border-radius: 8px;
            background: rgba(0,0,0,.6);
            img{
                display: block;
                width: 60px;
                height: 60px;
            }
        }

    }
    .rgba{
        background: rgba(0,0,0,0.1);
    }
</style>