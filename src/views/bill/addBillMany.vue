<template>
    <div class="container">
        <div class="tab">
            <router-link :to="{path:'addBillSingle', query:{action:'back_close_webview'}}">一次性还清</router-link>
            <a class="active" href="javaScript:void (0);">每月定期还款</a>
        </div>
        <jn-item :config="itemConfig" @click.native="selectPaltform">
            <div class="item" slot="left">借款平台</div>
            <div slot="right">{{platformName}}</div>
        </jn-item>
        <jn-item :config="itemConfig" @click.native="showSelectLimit = true">
            <div class="item" slot="left">借款期限</div>
            <div slot="right">{{totalPeriods}}个月</div>
        </jn-item>
        <jn-item :config="itemConfig" @click.native="showPickRepayDate = true">
            <div class="item" slot="left">首次还款日</div>
            <div slot="right">{{firstOfRepay}}</div>
        </jn-item>
        <jn-item :config="itemConfig">
            <div class="item" slot="left">每期还款</div>
            <input dir="rtl" slot="right" type="number" v-model="eachRepay">
        </jn-item>
        <div class="upload">
            <h4>账单截图</h4>
            <van-uploader class="picBox" :after-read="onReadFirstPic" accept="image/jpg,image/png, image/jpeg">
                <img v-if="firstImage" :src="firstImage" alt="">
                <van-icon v-else name="plus" class="icon"/>
            </van-uploader>
            <van-uploader class="picBox" :after-read="onReadSecondPic" accept="image/jpg,image/png, image/jpeg">
                <img v-if="secondImage" :src="secondImage" alt="">
                <van-icon v-else name="plus" class="icon"/>
            </van-uploader>
            <van-uploader class="picBox" :after-read="onReadThirdPic" accept="image/jpg,image/png, image/jpeg">
                <img v-if="thirdImage" :src="thirdImage" alt="">
                <van-icon v-else name="plus" class="icon"/>
            </van-uploader>
        </div>
        <jn-button class="btn" :click="addBill">确定</jn-button>
        <div class="vantpickBox" v-show="showPickRepayDate||showSelectLimit">
            <van-datetime-picker v-show="showPickRepayDate" class="vantpick" v-model="currentDate" @cancel="cancel('repayDate')" @confirm="repayDateConfirm" type="date" :formatter="dateFormatter" title="首次还款日"/>
            <van-picker class="vantpick" show-toolbar title="借款期限" v-show="showSelectLimit" :columns="dateColumns" @cancel="cancel('limit')" @confirm="limitConfirm"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "addBillMany",
        data(){
            return {
                baseUrl: process.env.BASE_URL,
                //自定义item设置参数
                itemConfig:{
                    icon: false,
                    left: true,
                    right: true,
                    arrow: true
                },
                columns:["待还","逾期","结清"],
                dateColumns:["1","2","3","4","5","6","7","8","9","10","11","12"],
                currentDate:new Date(),
                showPickRepayDate:false,
                showSelectLimit:false,
                firstOfRepay:'',        //还款日期
                eachRepay:'',       //还款金额
                totalPeriods:1,       //借款总期数
                billImages:'',       //账单截图
                firstImage:"",       //账单截图
                secondImage:"",       //账单截图
                thirdImage:"",       //账单截图
                platformName:this.$route.query.platformName?this.$route.query.platformName:'',       //平台名称
            }
        },
        computed:{
            //账单是否填写完整
            canPostBill:function () {
                return this.firstOfRepay&&this.eachRepay&&this.platformName;
            }
        },
        mounted() {

        },
        methods:{
            //添加账单
            addBill() {
                if(!this.canPostBill){
                    this.$util.Toast({message: '请完整填写表单'});
                    return;
                }
                if(!this.firstImage||!this.secondImage||!this.thirdImage){
                    this.$util.Toast({message: '请上传账单截图'});
                    return;
                }
                this.billImages = this.firstImage+','+this.secondImage+','+this.thirdImage;
                let postData = {
                    borrowPlatform: this.platformName,
                    eachRepay: this.eachRepay,
                    installment: 1,
                    firstOfRepay: this.firstOfRepay,
                    totalPeriods: this.totalPeriods,
                    billImages: this.billImages,
                    userName: localStorage.userName,
                    borrowStatus:1,
                }
                this.$myHttp.formPost('/bill/addBill', postData, 2).then((res) => {
                    if (res.result.code === '1000') {
                        this.$util.Toast({message: '添加成功'});
                        //app关闭当前webview
                        window.location.href = '/opennative?name=CLOSE_WEBVIEW';
                        // this.$router.push({name:'bill'});
                    } else {
                        this.$util.Toast({message: res.result.msg});
                    }
                });
            },
            //读取第一张截图
            onReadFirstPic(file){
                const picfile = file.file;
                this.handleFile(picfile,'firstImage');
            },
            //读取第二张截图
            onReadSecondPic(file){
                const picfile = file.file;
                this.handleFile(picfile,'secondImage');
            },
            //读取第三张截图
            onReadThirdPic(file){
                const picfile = file.file;
                this.handleFile(picfile,'thirdImage');
            },
            //处理上传图片
            handleFile(pic,name){
                if(pic.size>1024*1024*5){
                    this.$util.Toast({message: '上传图片过大!'});
                    return
                }
                let quality = 0.5
                if(pic.size>1024*1024*2){
                    //压缩图片上传
                    quality = 0.3;
                    this.$util.photoCompress(pic,{quality},(file)=>{
                        this.postFile(file,name);
                    });
                }else if(pic.size>1024*1024*1){
                    quality = 0.6;
                    this.$util.photoCompress(pic,{quality},(file)=>{
                        this.postFile(file,name);
                    });
                }else {
                    this.postFile(pic,name);
                }
            },
            //上传图片
            postFile(file,name){
                this.$myHttp.filePost('/bill/upload',file, 2).then((res) => {
                    if (res.result.code === '1000') {
                        this[name] = res.result.data.result.url;
                    } else {
                        this.$util.Toast({message: res.result.msg});
                    }
                });
            },
            //选择平台名称
            selectPaltform(){
                    // let url = window.location.origin+this.baseUrl+'selectPlatform?action=back_close_webview';
                    // //app中新的webview打开页面
                    // const params = {url};
                    // window.location.href = '/opennative?name=WEBVIEW&params=' + this.$base64.encodeURI(JSON.stringify(params));
                    this.$router.push({name:'selectPlatform',query:{url:'addBillMany',action:'back_close_webview'}});
            },
            //日期选择文案处理
            dateFormatter(type, value) {
                if (type === 'year') {
                    return `${value}年`;
                } else if (type === 'month') {
                    return `${value}月`
                }else if (type === 'day') {
                    return `${value}日`
                }
                return value;
            },
            //选择框取消
            cancel(type){
                if(type==='limit'){
                    this.showSelectLimit = false;
                }else if(type==='repayDate'){
                    this.showPickRepayDate = false;
                }
            },
            //选择首次还款日期确定
            repayDateConfirm(value){
                let time = value.getTime();
                this.firstOfRepay =  this.$util.formatDateTime(time,false);
                this.showPickRepayDate = false;
            },
            //确定借款期限
            limitConfirm(values){
                this.totalPeriods = values;
                this.showSelectLimit = false;
            },
        }
    }
</script>

<style scoped lang="less">
    .container{
        padding-bottom: 80px;
        .tab{
            height: 100px;
            background: #ffffff;
            display: flex;
            justify-content: space-between;
            &>a{
                text-align: center;
                line-height: 100px;
                display: block;
                width: 50%;
                border-bottom: 1px solid #E8EAEF;
                font-size: 32px;
                color: #333;
            }
            .active{
                border-bottom: 5px solid #14ABFA;
                color: #14ABFA;
            }
        }
        .upload{
            height: 330px;
            margin-top: 16px;
            background: #ffffff;
            padding-top: 28px;
            padding-left: 32px;
            margin-bottom: 16px;
            box-sizing: border-box;
            h4{
                margin-bottom: 22px;
                color: #999999;
                font-size: 30px;
            }
            .picBox{
                border: 1px #979797 dashed;
                width: 200px;
                height: 200px;
                float: left;
                margin-right: 36px;
                &>i{
                    font-size: 58px;
                    color: #979797;
                    display: block;
                    margin: 68px auto 0;
                }
                &>img{
                    position: absolute;
                    top: 1px;
                    left: 1px;
                    width: 198px;
                    height: 198px;
                }
            }
            .picBox:last-of-type{
                margin-right: 0;
            }
            .icon{
                width: 48px;
            }
        }
        .item{
            color: #333;
            font-size: 30px;
        }
        select{
            height: 100px;
            color: #333;
            font-size: 30px;
            text-align: right;
            width: 200px;
        }
        input{
            font-size: 30px;
            line-height: 30px;
        }
        .btn{
            margin-top: 120px;
        }
    }
</style>