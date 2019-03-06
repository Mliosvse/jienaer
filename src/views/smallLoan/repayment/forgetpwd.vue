<template>
  <div>
    <forget-pwd @setNewPwdComplete="handleSetPwdComplete"></forget-pwd>
  </div>
</template>

<script>
import ForgetPwd from '@/components/forgetpwd'
import { apiSetPayPassword } from '@/api/borrow'
export default {
  methods:{
    handleSetPwdComplete(pwd){
      let params = {
        payPassword: pwd
      }
      apiSetPayPassword(params).then(res=>{
        console.log(res);
        if (res.code === 'SUCCESS') {
          this.$router.push({
            path: '/billDetail'
          })
        } else {
          this.$toast(res.msg)
        }
      })
    }
  },
  components: {
    ForgetPwd
  }
}
</script>
