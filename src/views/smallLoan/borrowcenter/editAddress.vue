<template>
  <div class="edit-address">
    <jn-formbox name="收货人" icon="tel" :iconClick="handleMobile">
      <input type="text" v-model="receiverName">
    </jn-formbox>
    <jn-formbox name="手机号码">
      <input type="text" v-model="receiverMobile" />
    </jn-formbox>
    <jn-formbox @click.native="isAreaListShow=true" name="所在地区" icon="select">
      <input type="text" disabled :value="province && province+'/'+city+'/'+region">
    </jn-formbox>
    <div class="text-box">
      <textarea placeholder="详细地址：如街道、门牌号、小区、楼栋号、单元室等" name="" v-model="address" id="" rows="10"></textarea>
    </div>
    <van-popup
      v-model="isAreaListShow"
      :overlay="true"
      :close-on-click-overlay="true"
      position="bottom"
    >
      <van-area
        @confirm="handleAreaConfirm"
        @cancel="isAreaListShow=false"
        :value="areaValue"
        :area-list="areaList" />
    </van-popup>
    <jn-button class="saveBtn" :click="handleAddAddress">保存</jn-button>
  </div>
</template>

<script>
import areaList from '@/config/areaList'
import { apiEditAddress, apiAddAddress } from '@/api/borrow'
export default {
  data(){
    return {
      areaList,
      areaValue: '',
      isAreaListShow: false,
      id: '',     //地址ID
      province: '', // 省份
      city: '', // 城市
      region: '', // 地区
      address: '', //详细地址
      receiverName: '', // 收货人姓名
      receiverMobile: '' // 收货人手机号
    }
  },
  mounted(){
    this.setAdress();
    window.nativeGetEmergencyContact = this.nativeGetEmergencyContact
  },
  methods: {
    //路由上获取地址信息赋值
    setAdress(){
        let data = this.$route.query.address;
        if(data) {
          data = JSON.parse(data);
          this.id = data.id;
          this.receiverName = data.receiverName;
          this.receiverMobile = data.receiverMobile;
          this.province = data.province;
          this.city = data.city;
          this.region = data.region;
          this.address = data.address;
        }
    },
    handleAreaConfirm(arr) {
      this.isAreaListShow = false
      this.province = arr[0]['name'] // 省
      this.city = arr[1]['name'] // 市
      this.region = arr[2]['name'] // 区
      this.areaValue = arr[arr.length-1]['code'] //当前选中的地区code
    },
    handleMobile() {
      window.location = '/opennative?name=EMERGENCY_CONTACT'
    },
    nativeGetEmergencyContact (str) {
      let getMap = JSON.parse(this.$base64.decode(window.decodeURIComponent(str)))
      console.log('紧急联系人数据', getMap)
      this.receiverMobile = getMap.EmergencyContact.phone
      this.receiverName = getMap.EmergencyContact.name
    },
    // 新增/编辑 收货地址
    handleAddAddress () {
      let params = {
        receiverName: this.receiverName,// 收货人
        receiverMobile: this.receiverMobile, // 收货人手机号	 
        province: this.province, // 省份
        city: this.city, // 城市
        region: this.region, // 地区
        address: this.address, // 详细地址
      }
      if(this.id){
        params.id = this.id;
        apiEditAddress(params).then(res=>{
          if (res.result.code === '1000') {
            this.$toast('修改成功');
            this.$router.push({path: '/myAddress', query: {goods: this.$route.query.goods}});
          }else {
            this.$toast(res.result.msg)
          }
        });
      }else {
        apiAddAddress(params).then(res=>{
          if(res.result.code==='1000'){
            this.$toast('添加成功');
            this.$router.push({path: '/myAddress', query: {goods: this.$route.query.goods}});
          }else {
            this.$toast(res.result.msg);
          }
        });
      }
    },
  }
}
</script>

<style lang="less">
  .edit-address {
    .text-box {
      padding: 0 32px;
      background: #fff;
      textarea {
        padding: 32px 0 32px;
        width: 100%;
        border: none;
      }
    }
    .saveBtn{
      margin-top: 60px;
    }
  }
</style>
