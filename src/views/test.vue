<template>
    <div>
        <a href="http://www.baidu.com?name=ENVIRONMENT_PARAMS">获取手机环境信息</a>
        <input type="text" v-model="mobile"/>
    </div>
</template>

<script>
    export default {
        name: "test",
        data(){
            return{
                mobile:'',
            }
        },
        filters: {
            checkMobile1: function (value) {
                if (!value) return '';
                if(typeof value.substr(-1,1) !== "number"){
                    return value.substr(-2);
                }else {
                    return value;
                }
            }
        },
        computed:{
            checkMobile: {
                get: function () {
                    return this.mobile; //获取的时候直接获取值
                },
                set: function (value) {
                    this.mobile = value.toUpperCase(); //设置的时候变为大写
                }
            }
        },
        directives:{
            mobile:{
                componentUpdated:function (el,binding) {
                    console.log(binding.oldValue);
                    console.log(binding.value.substr(-1,1));
                }
            }
        },
        mounted() {
            let deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
            console.log(deviceInfo);
        }
    }
</script>

<style scoped lang="less">
a{
    font-size: 48px;
}
    input{
        width: 300px;
        height: 60px;
        border: 1px solid #C1C1C1;
    }

</style>