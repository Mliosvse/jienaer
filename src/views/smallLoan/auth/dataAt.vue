<template>
  <div class="data-at">
    <at-list
      v-for="(item, index) in authList"
      :key="index"
      :title="item[0] | disposeName"
      :state="item[1] | disposeState"
      :isLink="item[1]===3||item[1]===0||item[0]==='supplyStatus'?true:false"
      @click.native="handleGoAuth(index, item)"
    />
  </div>
</template>

<script>
  import atList from "@/components/atList";
  import {apiQueryUserAuthStatus} from '@/api/auth'
  import {apiAuthMobile} from '@/api/auth'
  export default {
    name: "dataAt",
    components: {
      atList
    },
    data() {
      return {
        authList: []
      };
    },
    filters: {
      disposeName (name) {
        if (name === 'mobileStatus') return '运营商认证'
        if (name === 'realStatus') return '身份认证'
        if (name === 'supplyStatus') return '补充信息认证'
      },
      disposeState(state) {
      if (state === 0 || state === -1) return '待认证'
      if (state === 1) return '已认证'
      if (state === 2) return '认证中'
      if (state === 3) return '认证过期'
    }
    },
    mounted(){
      this.getApiQueryUserAuthStatus()
    },
    methods: {
      handleGoAuth(index, item){
        let authArr = this.authList.slice(0, index)
        for(let i=0; i<authArr.length; i++){
          if (authArr[i].includes(0)) {
            this.$toast('请按顺序进行认证');
            return false
          }
        }
        // 如果当前项已认证或认证中就不能点击
        if (item[1] !== 0 && item[1] !== 3 && item[0]!=='supplyStatus') {
          return false
        }
        if (item[0] === 'mobileStatus') {
          apiAuthMobile().then(res=>{
            if(res.result.code === "1000") {
              window.location = '/opennative?name=WEBVIEW&params='+this.$base64.encodeURI(JSON.stringify({"url": res.result.data.url}))
            } else {
              this.$toast(res.result.msg)
            }
          })
        }
        if (item[0] === 'supplyStatus') {
          this.$router.push({
            path: '/auth/supplementData',
            query: {
              routerFrom: 'auth/dataAt'
            }
          })
        }
        if (item[0] === 'realStatus') {
          window.location = '/opennative?name=IDENTITY_AUTH'
        }
      },
      getApiQueryUserAuthStatus() {
        let userName = localStorage.getItem('userName') || ''
        let params = {
          id: 'H5',
          userName: userName
        }
        apiQueryUserAuthStatus(params).then(res=>{
          if (res.result.code === '1000') {
            this.authList = Object.entries(res.result.data)
          } else {
            this.$toast(res.result.msg)
          }
        })
      }
    }
  };
</script>

<style lang="less">
  .data-at {
    margin-top: 18px;
  }
</style>