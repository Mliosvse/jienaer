<template>
    <div class="container">
        <div class="tab">
            <a class="active" href="javaScript:void (0);">一次性还清</a>
            <router-link :to="{path:'addBillMany', query:{action:'back_close_webview'}}">每月定期还款</router-link>
        </div>
        <jn-item :config="itemConfig" @click.native="selectPaltform">
            <div class="item" slot="left">借款平台</div>
            <div slot="right">{{platformName}}</div>
        </jn-item>
        <jn-item :config="itemConfig" @click.native="showPickDate=true">
            <div class="item" slot="left">还款日期</div>
            <div slot="right">{{dateOfRepay}}</div>
        </jn-item>
        <jn-item :config="itemConfig">
            <div class="item" slot="left">还款金额</div>
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
        <jn-item :config="itemConfig" @click.native="showSelectBox = true">
            <div class="item" slot="left">借款状态</div>
            <div slot="right">{{borrowStateTxt}}</div>
        </jn-item>
        <jn-button class="btn" :click="addBill">确定</jn-button>
        <div class="vantpickBox" v-show="showPickDate||showSelectBox">
            <van-datetime-picker v-show="showPickDate" class="vantpick" v-model="currentDate" @cancel="dateCancel" @confirm="dateConfirm" type="date" :formatter="dateFormatter" title="还款日期"/>
            <van-picker class="vantpick" show-toolbar title="借款状态" defaultIndex="2" v-show="showSelectBox" :columns="columns" @cancel="typeCancel" @confirm="typeConfirm"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "addBillSingle",
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
                currentDate:new Date(),
                showPickDate:false,
                showSelectBox:false,
                dateOfRepay:'',        //还款日期
                eachRepay:'',       //还款金额
                borrowState:1,       //借款状态
                billImages:'',       //账单截图
                firstImage:"",       //账单截图
                secondImage:"",       //账单截图
                thirdImage:"",       //账单截图
                borrowStateTxt:'待还',       //借款状态
                platformName:this.$route.query.platformName?this.$route.query.platformName:'',       //平台名称
            }
        },
        computed:{
            //账单是否填写完整
            canPostBill:function () {
                return this.dateOfRepay&&this.eachRepay&&this.platformName;
            }
        },
        mounted(){

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
                    installment: 0,
                    dateOfRepay: this.dateOfRepay,
                    billImages: this.billImages,
                    userName: localStorage.userName,
                    borrowStatus:this.borrowState,
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
            selectPaltform(){
                    // let url = window.location.origin+this.baseUrl+'selectPlatform?action=back_close_webview';
                    // //app中新的webview打开页面
                    // const params = {url};
                    // window.location.href = '/opennative?name=WEBVIEW&params=' + this.$base64.encodeURI(JSON.stringify(params));
                    this.$router.push({name:'selectPlatform',query:{url:'addBillSingle',action:'back_close_webview'}});
            },
            dateCancel(){
                this.showPickDate = false;
            },
            dateConfirm(value){
                let time = value.getTime();
                this.dateOfRepay =  this.$util.formatDateTime(time,false);
                this.showPickDate = false;
            },
            typeCancel(){
                this.showSelectBox = false;
            },
            typeConfirm(values){
                this.borrowStateTxt = values;
                if(values==="逾期"){
                    this.borrowState = 0;
                }else if(values==='待还'){
                    this.borrowState = 1;
                }else if(values==='结清'){
                    this.borrowState = 2;
                }
                this.showSelectBox = false;
            }
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
            margin-right: 36px;
            float: left;
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