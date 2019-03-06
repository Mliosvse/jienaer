<template>
  <div class="supplement-data">
    <jn-formbox name="贷款用途" icon="select" class="first">
      <select dir="rtl" name v-model="loanPurpose">
        <option
          v-for="(item, index) in loanPurposeOption"
          :key="index" :value="item.value">{{item.name}}</option>
      </select>
    </jn-formbox>
    <jn-formbox name="紧急联系人1—关系" icon="select">
      <select dir="rtl" name v-model="kinsfolkContact.relation">
        <option
          v-for="(item, index) in kinsfolkOption"
          :key="index" :value="item.value">{{item.name}}</option>
      </select>
    </jn-formbox>
    <jn-formbox name="紧急联系人1—电话" icon="tel">
      <div class="jn-formbox-div" @click="handleGetTel('kinsfolkContact')">{{kinsfolkContact.mobile}}</div>
    </jn-formbox>
    <jn-formbox name="紧急联系人1—姓名">
      <input type="text" v-model="kinsfolkContact.name">
    </jn-formbox>
    <jn-formbox name="紧急联系人2—关系" icon="select" class="mt">
      <select dir="rtl" name v-model="friendContact.relation">
        <option
          v-for="(item, index) in friendOption"
          :key="index" :value="item.value">{{item.name}}</option>
      </select>
    </jn-formbox>
    <jn-formbox name="紧急联系人2—电话" icon="tel">
      <div class="jn-formbox-div" @click="handleGetTel('friendContact')">{{friendContact.mobile}}</div>
    </jn-formbox>
    <jn-formbox name="紧急联系人2—姓名">
      <input type="text" v-model="friendContact.name">
    </jn-formbox>

    <jn-button v-if="handleDisable()" class="btn" :click="handleSubmit">确定提交</jn-button>
    <jn-button v-else :disable="true" class="btn" :click="handleSubmit">确定提交</jn-button>
  </div>
</template>

<script>
  import {apiSubmitSupplyInfo, apiGetSupplyInfo} from '@/api/borrow'
  export default {
    name: "supplementData",
    data() {
      return {
        loanPurpose: '',
        routerFrom: '',
        loanPurposeOption: [
          {value: '', name: '请选择'},
          {value: '0', name: '购车贷款'},
          {value: '1', name: '医疗美容'},
          {value: '2', name: '网购贷款'},
          {value: '3', name: '装修贷款'},
          {value: '4', name: '教育培训贷款'},
          {value: '5', name: '旅游贷款'},
          {value: '6', name: '三农贷款'},
          {value: '7', name: '其他'},
        ],
        kinsfolkContact: {
          relation: '',
          mobile: '',
          name: ''
        },
        kinsfolkOption: [
          {value: '', name: '请选择'},
          {value: '0', name: '父母'},
          {value: '1', name: '配偶'},
          {value: '2', name: '兄弟姐妹'}
        ],
        friendContact: {
          relation: '',
          mobile: '',
          name: ''
        },
        friendOption: [
          {value: '', name: '请选择'},
          {value: '3', name: '同学'},
          {value: '4', name: '同事'},
          {value: '5', name: '朋友'}
        ],
        getMap: '',
        isKinsfolkContact: '',
        addressList: ''
      }
    },
    mounted(){
      console.log(window.location.href);
      this.routerFrom = this.$route.query.routerFrom
      window.nativeGetEmergencyContact = this.nativeGetEmergencyContact
      this.handleApiGetSupplyInfo()
    },
    methods: {
      handleApiGetSupplyInfo () {
        apiGetSupplyInfo({}).then(res=>{
          if(res.result.code === '1000') {
            this.addressList = res.result.data.addressList
            this.loanPurpose = res.result.data.loanUse
            this.emergencyContact = JSON.parse(res.result.data.emergencyContact)
            this.kinsfolkContact = this.emergencyContact[0]
            this.friendContact = this.emergencyContact[1]
          }
        })
      },
      handleDisable() {
        return this.loanPurpose && this.kinsfolkContact.relation && this.kinsfolkContact.mobile && this.kinsfolkContact.name && this.friendContact.relation && this.friendContact.mobile && this.friendContact.name
      },
      handleGetTel (type) {
        this.isKinsfolkContact = type === 'kinsfolkContact'
        window.location = '/opennative?name=EMERGENCY_CONTACT'
      },
      nativeGetEmergencyContact (str) {
        let getMap = JSON.parse(this.$base64.decode(window.decodeURIComponent(str)))
        this.addressList = getMap.addressList
        console.log('紧急联系人数据', getMap)
        if (this.isKinsfolkContact) {
          if (getMap.EmergencyContact.phone === this.friendContact.mobile) {
            return this.$toast('不可重复选择同一紧急联系人')
          }
          this.kinsfolkContact.mobile = getMap.EmergencyContact.phone
          this.kinsfolkContact.name = getMap.EmergencyContact.name
        } else {
          if (getMap.EmergencyContact.phone === this.kinsfolkContact.mobile) {
            return this.$toast('不可重复选择同一紧急联系人')
          }
          this.friendContact.mobile = getMap.EmergencyContact.phone
          this.friendContact.name = getMap.EmergencyContact.name
        }
      },
      handleSubmit () {
        let obj = {
          isOk: false
        }
        this.handleCheck(obj)
        if (!obj.isOk) {
          return false
        }
        // 补充信息认证
        this.handleApiSubmitSupplyInfo()
      },
      handleApiSubmitSupplyInfo(){
        let params = {
          loanUse: this.loanPurpose,
          emergencyContact: JSON.stringify([this.kinsfolkContact, this.friendContact]),
          addressList: this.addressList
        }
        console.log('loanUse', this.loanPurposeOption);
        console.log('emergencyContact', [this.kinsfolkContact, this.friendContact]);
        console.log('addressList', this.addressList);
        console.log(params);
        apiSubmitSupplyInfo(params).then(res=>{
          if(res.result.code==='1000') {
            this.$router.push({
              path: '/'+this.routerFrom
            })
          } else {
            this.$toast(res.result.msg)
          }
        })
      },
      handleCheck (obj) {
        if (this.loanPurpose === '') {
          this.$toast('请选择贷款用途')
          return false
        }
        for(let key in this.kinsfolkContact) {
          if (this.kinsfolkContact[key] === '') {
            this.$toast('请补充信息后提交')
            return false
          }
        }
        for(let key in this.friendContact) {
          if (this.friendContact[key] === '') {
            this.$toast('请补充信息后提交')
            return false
          }
        }
        return obj.isOk = true
      }
    }
  };
</script>

<style scoped lang="less">
  .supplement-data {
    .first {
      margin: 16px 0px;
    }
    .btn {
      margin-top: 94px;
    }
    .mt {
      margin-top: 18px;
    }
    .jn-formbox-div {
      width: 100%;
      height: 100%;
      font-size:28px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#333;
      line-height: 100px;
      text-align: right;
      padding-right: 96px;
      box-sizing: border-box;
    }
  }
</style>