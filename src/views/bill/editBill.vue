<template>
    <div class="container">
        <jn-item :config="itemConfig">
            <div class="item" slot="left">借款平台</div>
            <div slot="right">{{platformName}}</div>
        </jn-item>
        <jn-item :config="itemConfig" v-show="totalPeriods!==1" @click.native="showSelectLimit = true">
            <div class="item" slot="left">借款期限</div>
            <div slot="right">{{nowPeriods}}/{{totalPeriods}}期</div>
        </jn-item>
        <jn-item :config="itemConfig" @click.native="showPickRepayDate = true">
            <div class="item" slot="left">还款日期</div>
            <div slot="right">{{dateOfRepay}}</div>
        </jn-item>
        <jn-item :config="itemConfig">
            <div class="item" slot="left">还款金额</div>
            <div slot="right">{{eachRepay}}</div>
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
        <jn-item :config="itemConfig"  @click.native="showSelectBox = true">
            <div class="item" slot="left">借款状态</div>
            <div slot="right">{{borrowStateTxt}}</div>
        </jn-item>
        <div class="btnbox">
            <div @click="dialog_Show=true">删除</div>
            <div @click="updateBill">确定</div>
        </div>
        <div class="vantpickBox" v-show="showSelectBox">
            <van-picker ref="borrowState" class="vantpick" show-toolbar title="借款状态" :columns="columns" @cancel="cancel" @confirm="typeConfirm"/>
        </div>
        <div class="alert_fixed" v-show="dialog_Show">
            <div class="dialog">
                <p>确认删除该账单?</p>
                <div class="btn">
                    <div @click="dialog_Show=false">取消</div>
                    <div @click="deleteBill">确定</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "editBill",
        data(){
            return {
                //自定义item设置参数
                itemConfig:{
                    icon: false,
                    left: true,
                    right: true,
                    arrow: true
                },
                dialog_Show:false,
                columns:["待还","结清","逾期"],
                showSelectBox:false,
                id:this.$route.query.id,
                dateOfRepay:'',        //还款日期
                eachRepay:'',       //还款金额
                nowPeriods:"1",       //当前借款期数
                totalPeriods:"1",       //借款总期数
                borrowState:"",       //借款状态
                billImages:'',       //账单截图
                firstImage:"",       //账单截图
                secondImage:"",       //账单截图
                thirdImage:"",       //账单截图
                borrowStateTxt:'',       //借款状态
                platformName:'',       //平台名称
            }
        },
        mounted(){
          this.getBillData();
        },
        methods:{
            //获取账单详情
            getBillData(){
                let postData = {
                    billId:this.id,
                }
                this.$myHttp.formPost('/bill/findOneById',postData,1).then((res)=>{
                    if(res.result.code==='1000'){
                        this.dateOfRepay = res.result.data.dateOfRepay;
                        this.eachRepay = res.result.data.eachRepay;
                        this.nowPeriods = res.result.data.nowPeriods;
                        this.totalPeriods = res.result.data.totalPeriods;
                        this.borrowState = res.result.data.borrowStatus;
                        this.platformName = res.result.data.borrowPlatform;
                        const imagesArr = res.result.data.billImages ? res.result.data.billImages.split(','):[];
                        if(imagesArr.length===3){
                            this.firstImage = imagesArr[0];
                            this.secondImage = imagesArr[1];
                            this.thirdImage = imagesArr[2];
                        }
                        if(this.borrowState===0){
                            this.borrowStateTxt = "逾期";
                        }else if(this.borrowState===1){
                            this.borrowStateTxt = "待还";
                        }else if(this.borrowState===2){
                            this.borrowStateTxt = "结清";
                        }
                        this.$refs.borrowState.setColumnValue(this.borrowStateTxt);
                    }else {
                        this.$util.Toast({message:res.result.msg});
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
            //选择框取消
            cancel(){
                this.showSelectBox = false;
            },
            //选择借款状态确定
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
            },
            updateBill(){
                this.billImages = this.firstImage+','+this.secondImage+','+this.thirdImage;
                let postData = {
                    borrowStatus: this.borrowState,
                    billImages: this.billImages,
                    isDelete: 0,
                    id: this.id,
                }
                this.$myHttp.formPost('/bill/updateBill', postData, 2).then((res) => {
                    if (res.result.code === '1000') {
                        this.$util.Toast({message: '修改成功'});
                        this.$router.push({name:'bill'});
                    } else {
                        this.$util.Toast({message: res.result.msg});
                    }
                });
            },
            //确认删除账单
            deleteBill(){
                this.dialog_Show = false;
                let postData = {
                    id:this.id,
                    isDelete:1
                }
                this.$myHttp.formPost('/bill/updateBill',postData,2).then((res)=>{
                    if(res.result.code==='1000'){
                        this.$router.push({name:'bill'});
                    }else {
                        this.$util.Toast({message:res.result.msg});
                    }
                });
            },
        }
    }
</script>

<style scoped lang="less">
    .container{
        padding-bottom: 80px;
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
                margin: 0;
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
        .btnbox{
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 88px;
            line-height: 88px;
            display: flex;
            justify-content: space-between;
            font-size: 32px;
            &>div{
                width: 50%;
                text-align: center;
                background: #ffffff;
                color:#14ABFA;
            }
            &>div:last-of-type{
                background: #14ABFA;
                color: #ffffff;
            }
        }
        .dialog{
            width: 540px;
            height: 278px;
            margin: 400px auto 0;
            padding-top: 70px;
            box-sizing: border-box;
            background: #FCFCFC;
            border-radius: 24px;
            position: relative;
            &>p{
                color:#030303;
                font-size: 34px;
                text-align: center;
            }
            .btn{
                position: absolute;
                bottom: 0;
                left: 0;
                display: flex;
                width: 100%;
                height: 86px;
                line-height: 86px;
                font-size: 34px;
                border-top: 1px solid #e0e0e0;
                justify-content: space-between;
                div{
                    width: 50%;
                    text-align: center;
                    color: #007AFF;
                }
                div:first-of-type{
                    border-right: 1px solid #e0e0e0;
                }
            }
        }
    }
</style>